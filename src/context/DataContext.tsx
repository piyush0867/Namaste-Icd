import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, ICDCode, NAMASTECode } from '../services/apiService';
import { sampleData } from '../data/sampleData';

export type { ICDCode, NAMASTECode };

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact: string;
  createdAt: string;
}

interface FHIRCondition {
  resourceType: string;
  id: string;
  subject: { reference: string };
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  meta: {
    profile: string[];
  };
}

interface AuditDetails {
  action: string;
  resourceType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MappingRecord {
  id: string;
  patientId: string;
  namasteCode: string;
  namasteName: string;
  icdCode: string;
  icdName: string;
  mappingType: 'exact' | 'approximate' | 'partial';
  createdAt: string;
  fhirData: FHIRCondition;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  patientId?: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  details: AuditDetails;
}



interface DataContextType {
  patients: Patient[];
  mappingRecords: MappingRecord[];
  namasteData: NAMASTECode[];
  icdData: ICDCode[];
  isLoading: boolean;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  addMappingRecord: (record: Omit<MappingRecord, 'id' | 'createdAt'>) => void;
  searchNAMASTECodes: (query: string) => NAMASTECode[];
  searchICDCodes: (query: string) => ICDCode[];
  exportFHIRData: () => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [mappingRecords, setMappingRecords] = useState<MappingRecord[]>([]);
  const [namasteData, setNamasteData] = useState<NAMASTECode[]>(sampleData.namasteData);
  const [icdData, setIcdData] = useState<ICDCode[]>(sampleData.icdData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage on initialization
    const savedPatients = localStorage.getItem('healthcare_patients');
    const savedRecords = localStorage.getItem('healthcare_mapping_records');

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
    if (savedRecords) {
      setMappingRecords(JSON.parse(savedRecords));
    }
  }, []);

  useEffect(() => {
    // Save patients to localStorage whenever it changes
    localStorage.setItem('healthcare_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    // Save mapping records to localStorage whenever it changes
    localStorage.setItem('healthcare_mapping_records', JSON.stringify(mappingRecords));
  }, [mappingRecords]);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addMappingRecord = (recordData: Omit<MappingRecord, 'id' | 'createdAt'>) => {
    const fhirData = {
      resourceType: "Condition",
      id: `cond-${Date.now()}`,
      subject: { reference: `Patient/${recordData.patientId}` },
      code: {
        coding: [
          { 
            system: "NAMASTE", 
            code: recordData.namasteCode, 
            display: recordData.namasteName 
          },
          { 
            system: "ICD-11", 
            code: recordData.icdCode, 
            display: recordData.icdName 
          }
        ]
      },
      meta: {
        profile: ["http://hl7.org/fhir/StructureDefinition/Condition"]
      }
    };

    const newRecord: MappingRecord = {
      ...recordData,
      id: `MAP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      fhirData
    };
    setMappingRecords(prev => [...prev, newRecord]);
  };

  const searchNAMASTECodes = (query: string): NAMASTECode[] => {
    if (!query) return namasteData;
    const lowerQuery = query.toLowerCase();
    return namasteData.filter(code => 
      code.code.toLowerCase().includes(lowerQuery) ||
      code.name.toLowerCase().includes(lowerQuery) ||
      code.description.toLowerCase().includes(lowerQuery)
    );
  };

  const searchICDCodes = (query: string): ICDCode[] => {
    if (!query) return icdData;
    const lowerQuery = query.toLowerCase();
    return icdData.filter(code => 
      code.code.toLowerCase().includes(lowerQuery) ||
      code.name.toLowerCase().includes(lowerQuery) ||
      code.category.toLowerCase().includes(lowerQuery)
    );
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [namasteCodes, icdCodes] = await Promise.all([
        apiService.fetchNAMASTECodes(),
        apiService.fetchICDCodes()
      ]);
      setNamasteData(namasteCodes);
      setIcdData(icdCodes);
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Keep existing data if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const exportFHIRData = () => {
    const fhirBundle = {
      resourceType: "Bundle",
      id: `export-${Date.now()}`,
      type: "collection",
      entry: mappingRecords.map(record => ({
        resource: record.fhirData
      }))
    };

    const dataStr = JSON.stringify(fhirBundle, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `fhir-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <DataContext.Provider value={{
      patients,
      mappingRecords,
      namasteData,
      icdData,
      isLoading,
      addPatient,
      addMappingRecord,
      searchNAMASTECodes,
      searchICDCodes,
      exportFHIRData,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
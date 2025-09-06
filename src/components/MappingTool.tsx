import React, { useState } from 'react';
import { ArrowLeft, Search, Database, CheckCircle, AlertCircle, HelpCircle, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { NAMASTECode, ICDCode, Patient } from '../context/DataContext';
import { sampleData } from '../data/sampleData';

interface MappingToolProps {
  onBack: () => void;
}

interface MappingSuggestion {
  icdCode: string;
  matchType: 'exact' | 'approximate' | 'partial';
  confidence: number;
}

export function MappingTool({ onBack }: MappingToolProps) {
  const { patients, addMappingRecord, searchNAMASTECodes, searchICDCodes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedNAMASTECode, setSelectedNAMASTECode] = useState<NAMASTECode | null>(null);
  const [selectedICDCode, setSelectedICDCode] = useState<ICDCode | null>(null);
  const [mappingType, setMappingType] = useState<'exact' | 'approximate' | 'partial'>('exact');
  const [suggestions, setSuggestions] = useState<MappingSuggestion[]>([]);

  const namasteResults = searchNAMASTECodes(searchQuery);
  const icdResults = searchICDCodes(searchQuery);

  const handleNAMASTESelection = (code: NAMASTECode) => {
    setSelectedNAMASTECode(code);
    
    // Get suggestions for this NAMASTE code
    const codeSuggestions = sampleData.mappingSuggestions[code.code as keyof typeof sampleData.mappingSuggestions];
    if (codeSuggestions) {
      setSuggestions(codeSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleICDSelection = (code: ICDCode, suggestedType?: 'exact' | 'approximate' | 'partial') => {
    setSelectedICDCode(code);
    if (suggestedType) {
      setMappingType(suggestedType);
    }
  };

  const handleSaveMapping = () => {
    if (!selectedPatient || !selectedNAMASTECode || !selectedICDCode) return;

    addMappingRecord({
      patientId: selectedPatient,
      namasteCode: selectedNAMASTECode.code,
      namasteName: selectedNAMASTECode.name,
      icdCode: selectedICDCode.code,
      icdName: selectedICDCode.name,
      mappingType,
      fhirData: {} // Will be generated in context
    });

    // Reset form
    setSelectedNAMASTECode(null);
    setSelectedICDCode(null);
    setSuggestions([]);
    setSearchQuery('');
    alert('Mapping saved successfully!');
  };

  const getMappingTypeIcon = (type: string) => {
    switch (type) {
      case 'exact': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'approximate': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'partial': return <HelpCircle className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">NAMASTE-ICD11 Mapping Tool</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select Patient</h2>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a patient...</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (ID: {patient.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Code Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Search Medical Codes</h2>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by NAMASTE code, condition name, or keyword..."
                />
              </div>

              {/* NAMASTE Codes Results */}
              {searchQuery && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">NAMASTE Codes</h3>
                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {namasteResults.map((code) => (
                      <div
                        key={code.code}
                        onClick={() => handleNAMASTESelection(code)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedNAMASTECode?.code === code.code
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-mono text-sm text-blue-600 font-medium">{code.code}</p>
                            <p className="font-medium text-gray-900">{code.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{code.description}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {code.system}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ICD Suggestions */}
            {selectedNAMASTECode && suggestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Suggested ICD-11 Mappings</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion) => {
                    const icdCode = sampleData.icdData.find(icd => icd.code === suggestion.icdCode);
                    if (!icdCode) return null;
                    
                    return (
                      <div
                        key={suggestion.icdCode}
                        onClick={() => handleICDSelection(icdCode, suggestion.matchType)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedICDCode?.code === icdCode.code
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-mono text-sm text-green-600 font-medium">{icdCode.code}</p>
                              <div className="flex items-center space-x-1">
                                {getMappingTypeIcon(suggestion.matchType)}
                                <span className="text-xs font-medium text-gray-600 capitalize">
                                  {suggestion.matchType}
                                </span>
                              </div>
                            </div>
                            <p className="font-medium text-gray-900">{icdCode.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{icdCode.category}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">Confidence</span>
                            <p className="font-medium text-gray-900">{suggestion.confidence}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Manual ICD Search */}
            {selectedNAMASTECode && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Manual ICD-11 Search</h3>
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {searchQuery && icdResults.map((code) => (
                    <div
                      key={code.code}
                      onClick={() => handleICDSelection(code)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedICDCode?.code === code.code
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-sm text-green-600 font-medium">{code.code}</p>
                          <p className="font-medium text-gray-900">{code.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{code.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mapping Summary Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Mapping Summary
              </h2>

              {/* Selected NAMASTE Code */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">NAMASTE Code</h3>
                  {selectedNAMASTECode ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-mono text-sm text-blue-600 font-medium">{selectedNAMASTECode.code}</p>
                      <p className="font-medium text-gray-900">{selectedNAMASTECode.name}</p>
                      <p className="text-sm text-gray-600">{selectedNAMASTECode.system}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-sm text-gray-500">No NAMASTE code selected</p>
                    </div>
                  )}
                </div>

                {/* Selected ICD Code */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">ICD-11 Code</h3>
                  {selectedICDCode ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-mono text-sm text-green-600 font-medium">{selectedICDCode.code}</p>
                      <p className="font-medium text-gray-900">{selectedICDCode.name}</p>
                      <p className="text-sm text-gray-600">{selectedICDCode.category}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-sm text-gray-500">No ICD-11 code selected</p>
                    </div>
                  )}
                </div>

                {/* Mapping Type Selection */}
                {selectedNAMASTECode && selectedICDCode && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Mapping Type</h3>
                    <div className="space-y-2">
                      {(['exact', 'approximate', 'partial'] as const).map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="radio"
                            name="mappingType"
                            value={type}
                            checked={mappingType === type}
                            onChange={(e) => setMappingType(e.target.value as 'exact' | 'approximate' | 'partial')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            {getMappingTypeIcon(type)}
                            <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {selectedPatient && selectedNAMASTECode && selectedICDCode && (
                  <button
                    onClick={handleSaveMapping}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Mapping
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Reference</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Exact Match</span>
                  </div>
                  <span className="text-gray-600">Direct equivalent</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span>Approximate</span>
                  </div>
                  <span className="text-gray-600">Close equivalent</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    <span>Partial</span>
                  </div>
                  <span className="text-gray-600">Partial match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getMappingTypeIcon(type: string) {
  switch (type) {
    case 'exact': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'approximate': return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case 'partial': return <HelpCircle className="h-4 w-4 text-blue-500" />;
    default: return null;
  }
}
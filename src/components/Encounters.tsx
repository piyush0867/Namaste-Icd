import { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Clock, User, FileText, Stethoscope } from 'lucide-react';
import { useData } from '../context/DataContext';

interface EncountersProps {
  onBack: () => void;
}

interface Encounter {
  id: string;
  patientId: string;
  date: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'procedure';
  provider: string;
  notes: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
  };
}

export function Encounters({ onBack }: EncountersProps) {
  const { patients } = useData();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [encounters] = useState<Encounter[]>([
    // Sample encounters
    {
      id: '1',
      patientId: 'PAT-123',
      date: '2024-01-15',
      type: 'consultation',
      provider: 'Dr. Sharma',
      notes: 'Initial consultation for fever symptoms. Prescribed Ayurvedic medicines.',
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 70
      }
    },
    {
      id: '2',
      patientId: 'PAT-123',
      date: '2024-01-20',
      type: 'follow-up',
      provider: 'Dr. Sharma',
      notes: 'Follow-up visit. Patient reports improvement in symptoms.',
      vitalSigns: {
        bloodPressure: '118/78',
        heartRate: 70,
        temperature: 98.2,
        weight: 70.5
      }
    }
  ]);

  const patientEncounters = encounters.filter(encounter => encounter.patientId === selectedPatient);
  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  const getEncounterTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'procedure': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-xl font-semibold text-gray-900">Encounters</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Patient Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Select Patient
            </h2>
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

          {/* Patient Info */}
          {selectedPatientData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-medium text-gray-900">{selectedPatientData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-lg font-medium text-gray-900">{selectedPatientData.age} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-lg font-medium text-gray-900 capitalize">{selectedPatientData.gender}</p>
                </div>
              </div>
            </div>
          )}

          {/* Encounters List */}
          {selectedPatient && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Encounter History ({patientEncounters.length})
                </h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  New Encounter
                </button>
              </div>

              {patientEncounters.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No encounters recorded</h3>
                  <p className="text-gray-600">Encounters will appear here once they are recorded.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {patientEncounters.map((encounter) => (
                    <div key={encounter.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(encounter.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {new Date(encounter.date).toLocaleTimeString()}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEncounterTypeColor(encounter.type)}`}>
                            {encounter.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{encounter.provider}</p>
                          <p className="text-xs text-gray-500">Healthcare Provider</p>
                        </div>
                      </div>

                      {/* Vital Signs */}
                      {encounter.vitalSigns && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Vital Signs</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {encounter.vitalSigns.bloodPressure && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Blood Pressure</p>
                                <p className="font-medium text-gray-900">{encounter.vitalSigns.bloodPressure}</p>
                              </div>
                            )}
                            {encounter.vitalSigns.heartRate && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Heart Rate</p>
                                <p className="font-medium text-gray-900">{encounter.vitalSigns.heartRate} bpm</p>
                              </div>
                            )}
                            {encounter.vitalSigns.temperature && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Temperature</p>
                                <p className="font-medium text-gray-900">{encounter.vitalSigns.temperature}°F</p>
                              </div>
                            )}
                            {encounter.vitalSigns.weight && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Weight</p>
                                <p className="font-medium text-gray-900">{encounter.vitalSigns.weight} kg</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Clinical Notes</h4>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{encounter.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          {selectedPatient && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Encounters</p>
                    <p className="text-2xl font-bold text-gray-900">{patientEncounters.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Consultations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {patientEncounters.filter(e => e.type === 'consultation').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Follow-ups</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {patientEncounters.filter(e => e.type === 'follow-up').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Emergency</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {patientEncounters.filter(e => e.type === 'emergency').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

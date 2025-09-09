import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Calendar, User } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ProblemListProps {
  onBack: () => void;
}

export function ProblemList({ onBack }: ProblemListProps) {
  const { patients, mappingRecords } = useData();
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  const patientProblems = mappingRecords.filter(record => record.patientId === selectedPatient);
  const selectedPatientData = patients.find(p => p.id === selectedPatient);

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
              <h1 className="text-xl font-semibold text-gray-900">Problem List</h1>
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

          {/* Problems List */}
          {selectedPatient && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Active Problems ({patientProblems.length})
                </h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Problem
                </button>
              </div>

              {patientProblems.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No problems recorded</h3>
                  <p className="text-gray-600">Problems will appear here once they are added to the patient's record.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientProblems.map((problem) => (
                    <div key={problem.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-500">NAMASTE:</span>
                              <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {problem.namasteCode}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-500">ICD-11:</span>
                              <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                {problem.icdCode}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              problem.mappingType === 'exact'
                                ? 'bg-green-100 text-green-800'
                                : problem.mappingType === 'approximate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {problem.mappingType}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">NAMASTE Condition</p>
                              <p className="font-medium text-gray-900">{problem.namasteName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">ICD-11 Condition</p>
                              <p className="font-medium text-gray-900">{problem.icdName}</p>
                            </div>
                          </div>

                          <div className="flex items-center mt-3 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Recorded on {new Date(problem.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          {selectedPatient && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Problems</p>
                    <p className="text-2xl font-bold text-gray-900">{patientProblems.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Exact Matches</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {patientProblems.filter(p => p.mappingType === 'exact').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approximate Matches</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {patientProblems.filter(p => p.mappingType === 'approximate').length}
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

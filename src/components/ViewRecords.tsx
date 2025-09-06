import React, { useState } from 'react';
import { ArrowLeft, Search, Download, Filter, Calendar, Database } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ViewRecordsProps {
  onBack: () => void;
}

export function ViewRecords({ onBack }: ViewRecordsProps) {
  const { mappingRecords, patients, exportFHIRData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'exact' | 'approximate' | 'partial'>('all');

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const filteredRecords = mappingRecords.filter(record => {
    const matchesSearch = !searchTerm || 
      record.namasteCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.namasteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.icdCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.icdName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPatientName(record.patientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || record.mappingType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getMappingTypeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'bg-green-100 text-green-800';
      case 'approximate': return 'bg-orange-100 text-orange-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
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
              <h1 className="text-xl font-semibold text-gray-900">Mapping Records</h1>
            </div>
            <button
              onClick={exportFHIRData}
              disabled={mappingRecords.length === 0}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export FHIR Data
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search records..."
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'exact' | 'approximate' | 'partial')}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Mapping Types</option>
                <option value="exact">Exact Matches</option>
                <option value="approximate">Approximate Matches</option>
                <option value="partial">Partial Matches</option>
              </select>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">All Mapping Records</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filteredRecords.length} records
              </span>
            </div>
          </div>

          {filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMASTE Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ICD-11 Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mapping Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{getPatientName(record.patientId)}</div>
                        <div className="text-sm text-gray-500 font-mono">{record.patientId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono font-medium text-blue-600">{record.namasteCode}</div>
                        <div className="text-sm text-gray-900">{record.namasteName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono font-medium text-green-600">{record.icdCode}</div>
                        <div className="text-sm text-gray-900">{record.icdName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getMappingTypeColor(record.mappingType)}`}>
                          {record.mappingType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(record.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'No records match your search criteria.' 
                  : 'No mapping records have been created yet.'}
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go to Mapping Tool
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Users, MapPin as Mapping, FileText, BarChart3, LogOut, Stethoscope, Activity, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'patients' | 'mapping' | 'records' | 'analytics') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, logout } = useAuth();
  const { patients, mappingRecords } = useData();

  const menuItems = [
    {
      title: 'Patient Registration',
      description: 'Register new patients and manage patient records',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      action: () => onNavigate('patients'),
      count: patients.length
    },
    {
      title: 'Mapping Tool',
      description: 'Map NAMASTE codes to ICD-11 standards',
      icon: Mapping,
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
      action: () => onNavigate('mapping'),
      count: mappingRecords.length
    },
    {
      title: 'View Records',
      description: 'Browse and search all mapping records',
      icon: FileText,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      action: () => onNavigate('records'),
      count: mappingRecords.length
    },
    {
      title: 'Analytics',
      description: 'View mapping statistics and trends',
      icon: BarChart3,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: () => onNavigate('analytics'),
      count: null
    }
  ];

  const getStats = () => {
    const exactMappings = mappingRecords.filter(r => r.mappingType === 'exact').length;
    const approximateMappings = mappingRecords.filter(r => r.mappingType === 'approximate').length;
    const partialMappings = mappingRecords.filter(r => r.mappingType === 'partial').length;
    
    return { exactMappings, approximateMappings, partialMappings };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Stethoscope className="h-8 w-8 text-blue-600" />
                <span className="ml-3 text-xl font-bold text-gray-900">NAMASTE-ICD11</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Welcome, </span>
                <span className="font-medium text-gray-900">{user?.username}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Healthcare Coding Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Streamline your medical coding workflow by mapping traditional medicine codes (NAMASTE) 
            to international standards (ICD-11) with FHIR compliance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Database className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Mappings</p>
                <p className="text-2xl font-bold text-gray-900">{mappingRecords.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exact Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.exactMappings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approx. Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approximateMappings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex p-3 rounded-lg ${item.color} ${item.hoverColor} transition-colors group-hover:scale-105 duration-200`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  {item.count !== null && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.count}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Compliant with HL7 FHIR standards • Secure healthcare data management
          </p>
        </div>
      </div>
    </div>
  );
}
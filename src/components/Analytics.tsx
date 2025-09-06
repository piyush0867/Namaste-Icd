import React from 'react';
import { ArrowLeft, PieChart, TrendingUp, Database, Download } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AnalyticsProps {
  onBack: () => void;
}

export function Analytics({ onBack }: AnalyticsProps) {
  const { mappingRecords, patients } = useData();

  const getAnalyticsData = () => {
    const totalMappings = mappingRecords.length;
    const exactMappings = mappingRecords.filter(r => r.mappingType === 'exact').length;
    const approximateMappings = mappingRecords.filter(r => r.mappingType === 'approximate').length;
    const partialMappings = mappingRecords.filter(r => r.mappingType === 'partial').length;

    // Group by NAMASTE system
    const systemCounts = mappingRecords.reduce((acc, record) => {
      const system = record.namasteCode.split('-')[1]; // Extract AYU, SID, HOM from code
      acc[system] = (acc[system] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Most common conditions
    const conditionCounts = mappingRecords.reduce((acc, record) => {
      acc[record.namasteName] = (acc[record.namasteName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topConditions = Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      totalMappings,
      exactMappings,
      approximateMappings,
      partialMappings,
      systemCounts,
      topConditions,
      exactPercentage: totalMappings > 0 ? (exactMappings / totalMappings) * 100 : 0,
      approximatePercentage: totalMappings > 0 ? (approximateMappings / totalMappings) * 100 : 0,
      partialPercentage: totalMappings > 0 ? (partialMappings / totalMappings) * 100 : 0
    };
  };

  const analytics = getAnalyticsData();

  const PieChartComponent = ({ data, total }: { data: Array<{label: string, value: number, color: string}>, total: number }) => {
    if (total === 0) return null;
    
    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return (
      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);
          
          const x1 = centerX + radius * Math.cos(startAngleRad);
          const y1 = centerY + radius * Math.sin(startAngleRad);
          const x2 = centerX + radius * Math.cos(endAngleRad);
          const y2 = centerY + radius * Math.sin(endAngleRad);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
        
        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r="30" fill="white" />
        <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-sm font-bold fill-gray-900">
          {total}
        </text>
        <text x={centerX} y={centerY + 10} textAnchor="middle" className="text-xs fill-gray-500">
          Total
        </text>
      </svg>
    );
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
              <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mappingRecords.length > 0 ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Mappings</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalMappings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Exact Matches</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.exactMappings}</p>
                    <p className="text-xs text-gray-500">{analytics.exactPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <PieChart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approximate</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.approximateMappings}</p>
                    <p className="text-xs text-gray-500">{analytics.approximatePercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Partial</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.partialMappings}</p>
                    <p className="text-xs text-gray-500">{analytics.partialPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mapping Types Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Mapping Type Distribution</h3>
                <div className="flex flex-col items-center">
                  <PieChartComponent 
                    data={[
                      { label: 'Exact', value: analytics.exactMappings, color: '#10b981' },
                      { label: 'Approximate', value: analytics.approximateMappings, color: '#f59e0b' },
                      { label: 'Partial', value: analytics.partialMappings, color: '#3b82f6' }
                    ]}
                    total={analytics.totalMappings}
                  />
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between w-full max-w-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Exact</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{analytics.exactMappings}</span>
                    </div>
                    <div className="flex items-center justify-between w-full max-w-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Approximate</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{analytics.approximateMappings}</span>
                    </div>
                    <div className="flex items-center justify-between w-full max-w-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Partial</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{analytics.partialMappings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Conditions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Most Common Conditions</h3>
                <div className="space-y-4">
                  {analytics.topConditions.map(([condition, count], index) => (
                    <div key={condition} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-xs font-bold rounded-full mr-3">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{condition}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-600">{count}</span>
                    </div>
                  ))}
                  {analytics.topConditions.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* System Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Traditional Medicine System Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(analytics.systemCounts).map(([system, count]) => (
                  <div key={system} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {system === 'AYU' ? 'Ayurveda' : system === 'SID' ? 'Siddha' : system === 'HOM' ? 'Homeopathy' : system}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((count / analytics.totalMappings) * 100).toFixed(1)}% of mappings
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-4">No Data Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start creating mapping records to see detailed analytics and insights about your coding patterns.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Mapping Tool
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
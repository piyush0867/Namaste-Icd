import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { PatientRegistration } from './components/PatientRegistration';
import { MappingTool } from './components/MappingTool';
import { ViewRecords } from './components/ViewRecords';
import { Analytics } from './components/Analytics';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'patients' | 'mapping' | 'records' | 'analytics'>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'patients':
        return <PatientRegistration onBack={() => setCurrentView('dashboard')} />;
      case 'mapping':
        return <MappingTool onBack={() => setCurrentView('dashboard')} />;
      case 'records':
        return <ViewRecords onBack={() => setCurrentView('dashboard')} />;
      case 'analytics':
        return <Analytics onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {renderCurrentView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
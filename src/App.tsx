import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { PatientRegistration } from './components/PatientRegistration';
import { ProblemList } from './components/ProblemList';
import { Encounters } from './components/Encounters';
import { MappingTool } from './components/MappingTool';
import { ViewRecords } from './components/ViewRecords';
import { FHIRBundleUpload } from './components/FHIRBundleUpload';
import { Analytics } from './components/Analytics';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'patients' | 'problems' | 'encounters' | 'mapping' | 'records' | 'fhir-upload' | 'analytics'>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'patients':
        return <PatientRegistration onBack={() => setCurrentView('dashboard')} />;
      case 'problems':
        return <ProblemList onBack={() => setCurrentView('dashboard')} />;
      case 'encounters':
        return <Encounters onBack={() => setCurrentView('dashboard')} />;
      case 'mapping':
        return <MappingTool onBack={() => setCurrentView('dashboard')} />;
      case 'records':
        return <ViewRecords onBack={() => setCurrentView('dashboard')} />;
      case 'fhir-upload':
        return <FHIRBundleUpload onBack={() => setCurrentView('dashboard')} />;
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
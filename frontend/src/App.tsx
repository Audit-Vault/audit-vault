import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { ConnectServer } from './components/ConnectServer';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { OrganizationDashboard } from './components/OrganizationDashboard';

export type Screen = 'landing' | 'auth' | 'connect' | 'processing' | 'dashboard' | 'home';

export interface AuditReport {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  issues: Array<{
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  actionPlan: string[];
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [serverName, setServerName] = useState('');
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [userToken, setUserToken] = useState('');

  const handleAuthComplete = (token: string) => {
    setUserToken(token);
    setCurrentScreen('home');
  };

  const handleServerConnected = (name: string) => {
    setServerName(name);
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = (report: AuditReport) => {
    setAuditReport(report);
    setCurrentScreen('dashboard');
  };

  const handleGoToHome = () => {
    setCurrentScreen('home');
  };

  const handleStartNewAudit = () => {
    setCurrentScreen('connect');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentScreen('auth')} />;
      case 'auth':
        return <AuthPage onAuthComplete={handleAuthComplete} />;
      case 'home':
        return <OrganizationDashboard onStartNewAudit={handleStartNewAudit} />;
      case 'connect':
        return <ConnectServer userToken={userToken} onServerConnected={handleServerConnected} onBack={handleGoToHome} />;
      case 'processing':
        return <ProcessingScreen serverName={serverName} onComplete={handleProcessingComplete} />;
      case 'dashboard':
        return <ExecutiveDashboard report={auditReport!} serverName={serverName} onBack={handleGoToHome} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {renderScreen()}
    </div>
  );
}

export default App;
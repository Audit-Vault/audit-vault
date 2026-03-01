import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { AddServer } from './components/AddServer';
import { ServerDetail } from './components/ServerDetail';

// Wrapper components to handle navigation
function LandingPageWrapper() {
  const navigate = useNavigate();
  return <LandingPage onGetStarted={() => navigate('/auth')} />;
}

function AuthPageWrapper() {
  const navigate = useNavigate();

  const handleAuthComplete = (token: string) => {
    // Store token in localStorage
    localStorage.setItem('userToken', token);
    navigate('/dashboard');
  };

  return <AuthPage onAuthComplete={handleAuthComplete} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPageWrapper />} />
          <Route path="/auth" element={<AuthPageWrapper />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-server" element={<AddServer />} />
          <Route path="/server/:serverId" element={<ServerDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

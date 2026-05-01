import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobSearch from './pages/JobSearch';
import AiChat from './pages/AiChat';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('luminahire_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('luminahire_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('luminahire_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <AppLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/chat" element={<AiChat />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;

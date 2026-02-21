import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Leaderboard from './pages/Leaderboard';
import Events from './pages/Events';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ToiletLocator from './pages/ToiletLocator';
import RateToilet from './pages/RateToilet';
import Feedback from './pages/Feedback';
import ComplaintDetails from './pages/ComplaintDetails';
import SmartBinMap from './pages/SmartBinMap';
import LandingPage from './pages/LandingPage';
import AIChatbot from './components/landing/AIChatbot';

import Preloader from './components/Preloader';
import { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <ThemeProvider>
        {loading && <Preloader onFinish={() => setLoading(false)} />}
        <Router>
          <div className="min-h-screen font-sans text-slate-900 bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors duration-300">
            {!loading && <Navbar />}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Dashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['citizen', 'official', 'admin']} />}>
                <Route path="/complaint/:id" element={<ComplaintDetails />} />
                <Route path="/events" element={<Events />} />
                <Route path="/toilet-locator" element={<ToiletLocator />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/smart-bins" element={<SmartBinMap />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
                <Route path="/report-issue" element={<ReportIssue />} />
                <Route path="/rate-toilet" element={<RateToilet />} />
                <Route path="/feedback" element={<Feedback />} />
              </Route>
            </Routes>

            {/* Global Floating AI Chatbot */}
            <div className="fixed bottom-6 right-6 z-50">
              <AIChatbot />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

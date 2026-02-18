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

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen font-sans text-slate-900 bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <Routes>
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
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

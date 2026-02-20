import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ExpertsList from './pages/ExpertsList';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import ExpertDashboard from './pages/ExpertDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">ExpertBooker</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Experts</Link>
          {user ? (
            <>
              {user.role === 'expert' && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
              {user.role === 'user' && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
              <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Logout ({user.name})
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="app">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<ExpertsList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/expert/:id" element={<ExpertDetail />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ExpertDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/book/:expertId/:date/:time" element={
                  <ProtectedRoute>
                    <BookingForm />
                  </ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

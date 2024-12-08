import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {

  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;


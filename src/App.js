import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import initializeApp from './app/init';
import { useAuth } from './AuthContext';
// Importing pages
const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));
// Initializing different libraries
initializeApp();

function App() {
  const { notification } = useAuth();

  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Lắng nghe sự thay đổi của token trong localStorage
    const tokenFromStorage = localStorage.getItem('token');
    setToken(tokenFromStorage);
  }, []);

  return (
      <Router>

        {notification && (
            <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2">
              {notification}
            </div>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Place new routes over this */}
          <Route path="/admin/*" element={<Layout />} />

          <Route path="*" element={<Navigate to={token ? "/admin/chao-mung" : "/login"} replace />} />
        </Routes>
      </Router>
  );
}

export default App;

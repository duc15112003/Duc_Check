import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo một Context mới
const AuthContext = createContext();

// Tạo một Provider cho Context
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return savedIsLoggedIn === 'true' || false;
  });

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
  };

  const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;
      const now = new Date().getTime();
      if (now >= tokenExpiration) {
        logout();
      } else {
        setTimeout(() => {
          alert('Phiên đăng nhập của bạn đã hết hạn');
          logout();
        }, tokenExpiration - now);
      }
    }
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      checkTokenValidity();
    }
  };

  useEffect(() => {
    // Kiểm tra token khi component mount
    checkTokenValidity();

    // Đăng ký sự kiện visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo một custom hook để sử dụng trong các component
export const useAuth = () => useContext(AuthContext);

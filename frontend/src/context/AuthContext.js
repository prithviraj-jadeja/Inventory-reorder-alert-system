import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
//singleton 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user data in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userToken', user.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

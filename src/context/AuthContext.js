import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage and validate it
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        username,
        email,
        password
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
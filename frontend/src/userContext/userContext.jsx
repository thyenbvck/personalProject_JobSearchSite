// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        setUserInfo(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const login = (user) => {
    setUserInfo(user);
    setIsLoggedIn(true);
  };

  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
  
    cookies.forEach(cookie => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  };
  
  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    clearAllCookies(); // Xóa tất cả cookies
  };
  

  return (
    <UserContext.Provider value={{ userInfo, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

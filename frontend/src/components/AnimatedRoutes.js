import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LeaderBoard from './LeaderBoard';
import Login from './Login';
import ImportCSV from './ImportCSV';
import Home from './Home';
import About from './About';
import AddMember from './AddMember'; // 導入 AddMember 組件

// 創建一個受保護的路由組件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AnimatedRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderBoard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/import-csv" element={<ProtectedRoute><ImportCSV /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/add-member" element={<ProtectedRoute><AddMember /></ProtectedRoute>} /> {/* 新增這一行 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
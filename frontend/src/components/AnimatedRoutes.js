import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LeaderBoard from './LeaderBoard';
import Login from './Login';
import ImportCSV from './ImportCSV';
import Home from './Home';
import About from './About';
import AddMember from './AddMember';
import DeleteMember from './DeleteMember'; // 導入 DeleteMember 組件
import LiveRanking from './LiveRanking';

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
        <Route path="/add-member" element={<ProtectedRoute><AddMember /></ProtectedRoute>} />
        <Route path="/delete-member" element={<ProtectedRoute><DeleteMember /></ProtectedRoute>} /> {/* 新增刪除成員路由 */}
        <Route path="/live-ranking" element={<ProtectedRoute><LiveRanking /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
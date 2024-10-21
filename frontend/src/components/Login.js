import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// 定義動畫變體
const containerVariants = {
  hidden: { 
    opacity: 0, 
    y: '-100vh'  // 從頁面頂部外開始
  },
  visible: { 
    opacity: 1, 
    y: 0,  // 移動到其正常位置
    transition: { 
      type: 'spring', 
      damping: 15, 
      stiffness: 100,
      duration: 0.5 
    }
  },
  exit: { 
    opacity: 0, 
    y: '100vh',  // 向頁面底部外飛出
    transition: { ease: 'easeInOut' }
  }
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 這裡應該有實際的登入邏輯，與後端 API 交互
      if (username === 'admin' && password === 'password') {
        const fakeToken = 'fake-jwt-token';
        login(fakeToken);
        navigate('/home');
      } else {
        setError('用戶名或密碼錯誤');
      }
    } catch (error) {
      console.error('登入過程中發生錯誤:', error);
      setError('登入過程中發生錯誤，請稍後再試');
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">登錄</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">用戶名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">密碼</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            登錄
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Login;

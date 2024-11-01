import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaInfoCircle, FaUserPlus, FaUserMinus, FaFileImport, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  const menuItems = isAuthenticated
    ? [
        { 
          title: '首頁', 
          path: '/',
          icon: null
        },
        { 
          title: '排行榜', 
          path: '/leaderboard',
          icon: null
        },
        { 
          title: '導入玩家CSV', 
          path: '/import-csv',
          icon: <FaFileImport className="mr-2" />
        },
        { 
          title: '添加新成員', 
          path: '/add-member',
          icon: <FaUserPlus className="mr-2" />
        },
        { 
          title: '刪除成員', 
          path: '/delete-member',
          icon: <FaUserMinus className="mr-2" />,
          className: 'text-red-300 hover:text-red-100'
        },
        {
          title: '實時排行',
          path: '/live-ranking',
          icon: <FaChartLine className="mr-2" />
        }
      ]
    : [];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
              <span className="ml-2 text-xl font-semibold">排行榜系統</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium 
                    hover:bg-gray-700 focus:outline-none focus:bg-gray-700 
                    transition duration-150 ease-in-out flex items-center
                    ${item.className || ''}`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium 
                    hover:bg-gray-700 focus:outline-none focus:bg-gray-700 
                    transition duration-150 ease-in-out"
                >
                  登出
                </button>
              )}
              {isLoginPage && (
                <Link
                  to="/about"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition duration-150 ease-in-out flex items-center"
                >
                  <FaInfoCircle className="mr-2" />
                  About Creater
                </Link>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium 
                    text-gray-300 hover:text-white hover:bg-gray-700 
                    focus:outline-none focus:text-white focus:bg-gray-700 
                    transition duration-150 ease-in-out flex items-center
                    ${item.className || ''}`}
                  onClick={closeMenu}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >
                  登出
                </button>
              )}
              {isLoginPage && (
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out flex items-center"
                  onClick={closeMenu}
                >
                  <FaInfoCircle className="mr-2" />
                  About
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navigation;

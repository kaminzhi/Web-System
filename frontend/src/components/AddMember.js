import React, { useState } from 'react';
import axios from 'axios';
import { FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

// 定義頁面切換動畫
const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function AddMember() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});

  // 驗證輸入
  const validateInputs = () => {
    const newErrors = {};

    // 驗證名字
    if (!name.trim()) {
      newErrors.name = '名字不能為空';
    } else if (name.length > 50) {
      newErrors.name = '名字長度不能超過50個字符';
    } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/.test(name)) {
      newErrors.name = '名字只能包含中文、英文、數字和空格';
    }

    // 驗證暱稱（如果有填寫）
    if (nickname && nickname.length > 50) {
      newErrors.nickname = '暱稱長度不能超過50個字符';
    }

    // 驗證系班級
    if (!department.trim()) {
      newErrors.department = '系班級不能為空';
    } else if (department.length > 50) {
      newErrors.department = '系班級長度不能超過50個字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // 驗證輸入
    if (!validateInputs()) {
      setIsError(true);
      setMessage('請檢查輸入欄位');
      return;
    }

    try {
      const response = await axios.post('/api/players/add-member', { 
        name: name.trim(), 
        nickname: nickname.trim() || null,
        department: department.trim()
      });
      setMessage('成員成功加入所有遊戲');
      setName('');
      setNickname('');
      setDepartment('');
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.message || '添加成員時發生錯誤');
      setIsError(true);
    }
  };

  // 輸入欄位的通用樣式
  const inputClassName = (fieldName) => `
    shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
    focus:outline-none focus:shadow-outline
    ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}
  `;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="max-w-md mx-auto mt-10">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6 text-center">添加新成員</h2>
          
          {/* 名字欄位 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              名字 <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClassName('name')}
              id="name"
              type="text"
              placeholder="輸入名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
            )}
          </div>

          {/* 暱稱欄位 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nickname">
              暱稱 (可選)
            </label>
            <input
              className={inputClassName('nickname')}
              id="nickname"
              type="text"
              placeholder="輸入暱稱"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {errors.nickname && (
              <p className="text-red-500 text-xs italic mt-1">{errors.nickname}</p>
            )}
          </div>

          {/* 系班級欄位 */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
              系班級 <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClassName('department')}
              id="department"
              type="text"
              placeholder="輸入系班級 (例：四資管一A)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            {errors.department && (
              <p className="text-red-500 text-xs italic mt-1">{errors.department}</p>
            )}
          </div>

          {/* 提交按鈕 */}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                         focus:outline-none focus:shadow-outline flex items-center 
                         transition duration-300 ease-in-out transform hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              <FaUserPlus className="mr-2" />
              添加成員
            </button>
          </div>
        </form>

        {/* 錯誤/成功訊息 */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {message}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default AddMember;

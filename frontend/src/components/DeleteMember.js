import React, { useState } from 'react';
import axios from 'axios';
import { FaUserMinus, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: "-100vw", scale: 0.8 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: "100vw", scale: 1.2 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function DeleteMember() {
  const [name, setName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete('/api/players/delete-member', {
        data: { name }
      });
      setMessage('成員已成功從所有遊戲中刪除');
      setIsError(false);
      setName('');
    } catch (error) {
      setMessage(error.response?.data?.message || '刪除成員時發生錯誤');
      setIsError(true);
    } finally {
      setShowConfirm(false);
    }
  };

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
          <h2 className="text-2xl font-bold mb-6 text-center">刪除成員</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              成員名字 <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="輸入要刪除的成員名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
              type="submit"
              disabled={!name.trim()}
            >
              <FaUserMinus className="mr-2" />
              刪除成員
            </button>
          </div>
        </form>

        {/* 確認對話框 */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <FaExclamationTriangle className="mx-auto text-4xl text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">確認刪除</h3>
                <p className="mb-6">
                  確定要刪除成員 <span className="font-bold">{name}</span> 嗎？
                  此操作將從所有遊戲中移除該成員，且無法復原。
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleConfirmDelete}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    確認
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DeleteMember; 
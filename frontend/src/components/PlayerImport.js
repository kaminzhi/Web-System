import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaFileAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';

function PlayerImport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('請選擇 CSV 文件');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('請選擇要上傳的文件');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/csv/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setNotification(response.data);
      setFile(null);
      // 重置文件輸入
      e.target.reset();
    } catch (error) {
      setError(error.response?.data || '上傳失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">導入玩家</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="csvFile"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            {file ? (
              <div className="flex items-center space-x-2">
                <FaFileAlt className="text-green-500 text-xl" />
                <span className="text-gray-700">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <FaUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500 text-center">
                  點擊或拖拽上傳 CSV 文件
                  <br />
                  <span className="text-sm text-gray-400">
                    (格式: 姓名,暱稱,系班級)
                  </span>
                </p>
              </>
            )}
          </label>
        </div>

        <motion.button
          type="submit"
          className={`w-full py-2 rounded-md transition duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          disabled={loading}
        >
          {loading ? '處理中...' : '導入玩家'}
        </motion.button>
      </form>

      {/* 錯誤提示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-100 text-red-700 rounded-md"
          >
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成功提示 */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-green-100 text-green-700 rounded-md"
          >
            <div className="flex justify-between items-center">
              <p>{notification}</p>
              <button
                onClick={() => setNotification(null)}
                className="text-green-500 hover:text-green-700"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PlayerImport;

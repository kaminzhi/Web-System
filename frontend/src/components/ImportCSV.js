import React, { useState } from 'react';
import { FaUpload, FaFileAlt, FaEye, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';

function ImportCSV() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    previewCSV(selectedFile);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    previewCSV(droppedFile);
  };

  const previewCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        // 檢查是否有數據
        if (!result.data || result.data.length === 0) {
          setErrorMessage('CSV 文件是空的');
          setShowErrorDialog(true);
          setFile(null);
          setPreviewData(null);
          return;
        }

        // 獲取第一行作為標題
        const headers = Object.keys(result.data[0]);
        const expectedHeaders = ['Name', 'Nickname', 'Department'];
        
        // 檢查是否包含所需的所有欄位
        const missingHeaders = expectedHeaders.filter(header => 
          !headers.some(h => h === header)
        );

        if (missingHeaders.length > 0) {
          setErrorMessage(
            `CSV 格式不正確。缺少以下必要欄位：\n${missingHeaders.join(', ')}\n\n` +
            '請確保 CSV 檔案包含以下欄位：\n' +
            '- Name（姓名）\n' +
            '- Nickname（暱稱）\n' +
            '- Department（系班級）'
          );
          setShowErrorDialog(true);
          setFile(null);
          setPreviewData(null);
          return;
        }

        // 設置預覽數據（前5行）
        setPreviewData(result.data.slice(0, 5));
      },
      header: true, // 使用第一行作為標題
      skipEmptyLines: true, // 跳過空行
      error: (error) => {
        setErrorMessage(`解析 CSV 文件時發生錯誤：${error.message}`);
        setShowErrorDialog(true);
        setFile(null);
        setPreviewData(null);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('請選擇一個CSV文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/csv/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();

      if (response.ok) {
        setShowSuccessDialog(true);
        setFile(null);
        setPreviewData(null);
      } else {
        setErrorMessage(result);
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error('上傳過程中發生錯誤:', error);
      setErrorMessage('上傳過程中發生錯誤');
      setShowErrorDialog(true);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  const closeErrorDialog = () => {
    setShowErrorDialog(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">導入玩家CSV</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div 
          className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FaFileAlt className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">拖放CSV文件到此處，或</p>
          <label htmlFor="csv-file" className="cursor-pointer text-blue-500 hover:text-blue-600">
            點擊選擇文件
          </label>
          <input
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <AnimatePresence>
          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-gray-100 rounded-lg"
            >
              <p className="text-gray-700 mb-2">已選擇文件：{file.name}</p>
              {previewData && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FaEye className="mr-2" />
                    CSV 預覽 (前5行)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          {Object.keys(previewData[0]).map((header, index) => (
                            <th key={index} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            {Object.values(row).map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUpload className="mr-2" />
          上傳CSV
        </motion.button>
      </form>

      {/* 成功對話框 */}
      <AnimatePresence>
        {showSuccessDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl">
              <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-4 text-center">上傳成功</h2>
              <p className="text-gray-600 mb-6 text-center">CSV文件已成功導入</p>
              <button
                onClick={closeSuccessDialog}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                確定
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 錯誤對話框 */}
      <AnimatePresence>
        {showErrorDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
              <FaExclamationCircle className="text-red-500 text-5xl mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-4 text-center">上傳失敗</h2>
              <p className="text-gray-600 mb-6 text-center whitespace-pre-line">{errorMessage}</p>
              <button
                onClick={closeErrorDialog}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                關閉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ImportCSV;

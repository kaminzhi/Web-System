import React, { useState } from 'react';
import { motion } from 'framer-motion';

function PlayerImport() {
  const [playerData, setPlayerData] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('導入玩家數據:', playerData);
    setPlayerData('');
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
        <div>
          <label htmlFor="playerData" className="block mb-2 text-sm font-medium text-gray-700">玩家數據 (CSV 格式)</label>
          <textarea
            id="playerData"
            value={playerData}
            onChange={(e) => setPlayerData(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            required
          />
        </div>
        <motion.button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          導入玩家
        </motion.button>
      </form>
    </motion.div>
  );
}

export default PlayerImport;

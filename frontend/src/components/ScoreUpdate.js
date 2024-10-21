import React, { useState } from 'react';
import { motion } from 'framer-motion';

function ScoreUpdate() {
  const [playerName, setPlayerName] = useState('');
  const [newScore, setNewScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('更新分數:', playerName, newScore);
    setPlayerName('');
    setNewScore('');
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">更新分數</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block mb-2 text-sm font-medium text-gray-700">玩家名稱</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="newScore" className="block mb-2 text-sm font-medium text-gray-700">新分數</label>
          <input
            type="number"
            id="newScore"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
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
          更新分數
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ScoreUpdate;

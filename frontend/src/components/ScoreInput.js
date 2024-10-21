import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const games = [
  "遊戲1", "遊戲2", "遊戲3", "遊戲4", "遊戲5", "遊戲6", "遊戲7"
];

function ScoreInput() {
  const [step, setStep] = useState('selectGame');
  const [selectedGame, setSelectedGame] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState('');
  const [currentScore, setCurrentScore] = useState(null);

  useEffect(() => {
    if (step === 'inputScore' && playerName) {
      setTimeout(() => {
        const mockCurrentScore = Math.floor(Math.random() * 1000);
        setCurrentScore(mockCurrentScore);
      }, 500);
    }
  }, [step, playerName]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setStep('inputScore');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交分數:', selectedGame, playerName, score);
    alert(`分數已更新：${playerName} 在 ${selectedGame} 中的新分數為 ${score}`);
    setStep('selectGame');
    setSelectedGame('');
    setPlayerName('');
    setScore('');
    setCurrentScore(null);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (step === 'selectGame') {
    return (
      <motion.div 
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">選擇遊戲</h1>
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <motion.button
              key={game}
              onClick={() => handleGameSelect(game)}
              className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {game}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">打分數 - {selectedGame}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        {currentScore !== null && (
          <motion.div 
            className="text-gray-600 bg-blue-100 p-3 rounded-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            當前分數: {currentScore}
          </motion.div>
        )}
        <div>
          <label htmlFor="score" className="block mb-2 text-sm font-medium text-gray-700">新分數</label>
          <input
            type="number"
            id="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <motion.button 
          type="submit" 
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          提交分數
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ScoreInput;

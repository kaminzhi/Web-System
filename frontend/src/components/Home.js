import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './Home.css';

const games = [
  { name: "遊戲一", winners: [
    { rank: 3, name: "王五", score: 900 },
    { rank: 2, name: "李四", score: 950 },
    { rank: 1, name: "張三", score: 1000 },
  ]},
  { name: "遊戲二", winners: [
    { rank: 3, name: "錢八", score: 880 },
    { rank: 2, name: "趙七", score: 930 },
    { rank: 1, name: "陳六", score: 980 },
  ]},
  {
    name: "遊戲三",
    winners: [
      { rank: 3, name: "孫五", score: 860 },
      { rank: 2, name: "周四", score: 910 },
      { rank: 1, name: "吳三", score: 960 },
    ]
  },
  {
    name: "遊戲四",
    winners: [
      { rank: 3, name: "周九", score: 840 },
      { rank: 2, name: "吳十", score: 890 },
      { rank: 1, name: "鄭十一", score: 940 },
    ]
  },
  {
    name: "遊戲五",
    winners: [
      { rank: 3, name: "陳十二", score: 820 },
      { rank: 2, name: "陳十三", score: 870 },
      { rank: 1, name: "陳十四", score: 920 },
    ]
  },
  {
    name: "遊戲六",
    winners: [
      { rank: 3, name: "陳十二", score: 820 },
      { rank: 2, name: "陳十三", score: 870 },
      { rank: 1, name: "陳十四", score: 920 },
    ]
  }
];

function Home() {
  const [time, setTime] = useState(new Date());
  const [currentGame, setCurrentGame] = useState(0);
  const [revealedRanks, setRevealedRanks] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [allGamesRevealed, setAllGamesRevealed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const handleReveal = () => {
    if (revealedRanks < 3) {
      setRevealedRanks(prevRanks => prevRanks + 1);
      if (revealedRanks === 2) {
        setTimeout(() => {
          setShowFireworks(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
      }
    } else {
      if (currentGame < games.length - 1) {
        setRevealedRanks(0);
        setShowFireworks(false);
        setCurrentGame(prevGame => prevGame + 1);
      } else {
        setAllGamesRevealed(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.3,
      rotateX: -90
    },
    visible: (custom) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: { 
        type: 'spring', 
        bounce: 0.4, 
        duration: 0.8,
        delay: custom * 0.2
      }
    })
  };

  const renderWinners = (gameIndex) => {
    const currentWinners = games[gameIndex].winners.sort((a, b) => a.rank - b.rank);
    return currentWinners.map((player, index) => (
      <motion.div
        key={`${gameIndex}-${player.rank}`}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`w-full max-w-md mb-6 p-6 rounded-lg shadow-2xl ${
          player.rank === 1 ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' :
          player.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
          'bg-gradient-to-r from-orange-300 to-orange-500'
        } transform hover:scale-105 transition duration-300`}
      >
        <div className="text-3xl font-bold mb-2 text-black text-center">第 {player.rank} 名</div>
        <div className="text-2xl mb-1 text-black text-center">{player.name}</div>
        <div className="text-xl text-black text-center">得分: {player.score}</div>
        {player.rank === 1 && <div className="crown">👑</div>}
      </motion.div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto mt-8 text-center relative overflow-hidden"
    >
      <div className="stars"></div>
      <h1 className="text-4xl font-bold mb-4 text-yellow-500">遊戲頒獎典禮</h1>
      <div className="mt-10">
        <motion.div
          className="text-8xl font-bold text-blue-600 glow"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {formatTime(time)}
        </motion.div>
      </div>
      {!allGamesRevealed ? (
        <>
          <motion.h2 
            className="text-3xl font-bold mt-8 mb-4 text-black"
            key={currentGame}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            {games[currentGame].name}
          </motion.h2>
          <div className="mt-10">
            <motion.button
              onClick={handleReveal}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xl shadow-lg transform hover:scale-105 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {revealedRanks === 3 ? '下一個遊戲' : '揭曉下一名'}
            </motion.button>
          </div>
          <div className="mt-10 flex flex-col-reverse items-center">
            <AnimatePresence>
              {games[currentGame].winners.slice(0, revealedRanks).map((player, index) => renderWinners(currentGame)[2 - index])}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div key={index} className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-black">{game.name}</h3>
              {renderWinners(index)}
            </div>
          ))}
        </div>
      )}
      {showFireworks && (
        <div className="fireworks">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
      )}
    </motion.div>
  );
}

export default Home;

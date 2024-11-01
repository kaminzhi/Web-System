import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaMedal, FaGamepad } from 'react-icons/fa';

function LiveRanking() {
  const [rankings, setRankings] = useState({});
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取所有遊戲的排名數據
  const fetchAllRankings = async () => {
    try {
      setError(null);
      // 獲取遊戲列表
      const gamesResponse = await axios.get('/api/games');
      const gamesList = gamesResponse.data;
      setGames(gamesList);

      // 獲取所有遊戲的排名
      const rankingsPromises = gamesList.map(game => 
        axios.post('/api/players/search', { gameName: game.id })
      );

      const rankingsResponses = await Promise.all(rankingsPromises);
      
      // 整理每個遊戲的排名數據
      const newRankings = {};
      rankingsResponses.forEach((response, index) => {
        const gameData = gamesList[index];
        newRankings[gameData.id] = response.data.slice(0, 10); // 只取前6名
      });

      setRankings(newRankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setError('獲取排名數據時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 初始加載和定期更新
  useEffect(() => {
    fetchAllRankings();
    const interval = setInterval(fetchAllRankings, 5000); // 每5秒更新一次
    return () => clearInterval(interval);
  }, []);

  // 獎牌顏色
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-500'; // 金
      case 2: return 'text-gray-400';   // 銀
      case 3: return 'text-yellow-600'; // 銅
      default: return 'text-gray-600';
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={fetchAllRankings}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重試
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin text-blue-500 text-4xl mb-4">⌛</div>
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        遊戲排行榜
      </h1>

      <div className="flex overflow-x-auto gap-4 pb-4">
        {games.map(game => (
          <div 
            key={game.id}
            className="flex-none w-80 bg-white rounded-lg shadow-lg p-4"
          >
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center">
              <FaGamepad className="mr-2" />
              {game.displayName}
            </h2>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {rankings[game.id]?.map((player, index) => (
                  <motion.div
                    key={player.name}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 50
                    }}
                    className={`
                      p-3 rounded-lg flex items-center
                      ${index < 3 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-50'}
                    `}
                  >
                    {/* 排名 */}
                    <div className="w-8 text-center">
                      {index < 3 ? (
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className={`text-xl ${getMedalColor(index + 1)}`}
                        >
                          {index === 0 ? <FaTrophy /> : <FaMedal />}
                        </motion.div>
                      ) : (
                        <span className="text-lg font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* 玩家資訊 */}
                    <div className="flex-grow ml-2">
                      <div className="font-bold text-sm">
                        {player.nickname || player.name}
                      </div>
                      <div className="text-xs opacity-75">
                        {player.department || '未設置系級'}
                      </div>
                    </div>

                    {/* 分數 */}
                    <motion.div 
                      className="text-lg font-bold ml-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {player.score}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 無數據提示 */}
              {(!rankings[game.id] || rankings[game.id].length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  暫無排名數據
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default LiveRanking;
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaChevronDown, FaChevronUp, FaSearch, FaPlusCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios'; // 確保已安裝 axios

const games = ["game1", "game2", "game3", "game4", "game5", "game6"];

// 頁面切換動畫
const pageVariants = {
  initial: {
    opacity: 0,
    y: "50vh",
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: "-50vh",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

function LeaderBoard({ setIsAuthenticated }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [containerHeight, setContainerHeight] = useState("auto");
  const [newScore, setNewScore] = useState('');
  const containerRef = useRef(null);
  const [showNickname, setShowNickname] = useState({});
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [isNickname, setIsNickname] = useState(false);
  const [showRealName, setShowRealName] = useState({});
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [currentPlayerNickname, setCurrentPlayerNickname] = useState('');

  const fetchLeaderboardData = useCallback(async (gameName) => {
    try {
      const response = await axios.post('/api/players/search', { 
        gameName,
        lastUpdateTime
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }
  }, [lastUpdateTime]);

  useEffect(() => {
    if (selectedGame) {
      fetchLeaderboardData(selectedGame).then(data => {
        setLeaderboardData(prevData => ({
          ...prevData,
          [selectedGame]: data.map((player, index) => ({
            ...player,
            rank: player.score > 0 ? index + 1 : null // 如果分數為0,rank設為null
          }))
        }));
      });
    }
  }, [selectedGame]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.scrollHeight);
    }
  }, [showAll, selectedGame, searchTerm]);

  const handleGameSelect = (game) => {
    if (selectedGame === game) {
      setIsOpen(!isOpen);
    } else {
      setSelectedGame(game);
      setIsOpen(true);
    }
    setShowAll(false);
    setSearchTerm('');
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: containerHeight,
      transition: { 
        height: { duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.3, delay: 0.2 }
      }
    }
  };

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-yellow-600';
      default: return 'text-gray-500';
    }
  };

  const filteredData = useMemo(() => {
    if (!selectedGame || !leaderboardData[selectedGame]) return [];
    return leaderboardData[selectedGame].filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.nickname && player.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [selectedGame, leaderboardData, searchTerm]);

  const handlePlayerClick = (player) => {
    if (player.nickname) {
      setSearchTerm(player.nickname);
      setIsNickname(true);
    } else {
      setSearchTerm(player.name);
      setIsNickname(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsNickname(false); // 重置為 false，因為用戶手動輸入時我們不知道是否為暱稱
  };

  const updateLeaderboard = useCallback(async () => {
    if (selectedGame) {
      const data = await fetchLeaderboardData(selectedGame);
      if (data.length > 0) {
        setLeaderboardData(prevData => ({
          ...prevData,
          [selectedGame]: data.map((player, index) => ({
            ...player,
            rank: player.score > 0 ? index + 1 : null
          }))
        }));
        setLastUpdateTime(Date.now());
      }
    }
  }, [selectedGame, fetchLeaderboardData]);

  const handleScoreSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (selectedGame && newScore && searchTerm) {
      const score = parseInt(newScore);
      if (!isNaN(score)) {
        try {
          const isRealNameShown = currentPlayerNickname && showRealName[currentPlayerName];
          await axios.put('/api/players/update-score', {
            gameName: selectedGame,
            playerName: isRealNameShown ? searchTerm : "null",
            nickname: isRealNameShown ? "" : searchTerm,
            newScore: score
          });
          
          // 顯示成功通知
          setNotification('分數更新成功');
          setTimeout(() => setNotification(null), 3000);

          // 重新獲取數據以更新排行榜
          await updateLeaderboard();
          
          // 重置所有玩家的顯示狀態為顯示暱稱
          setShowRealName({});
          
          setNewScore('');
          setSearchTerm('');
          setCurrentPlayerName('');
          setCurrentPlayerNickname('');
        } catch (error) {
          console.error('Error updating score:', error);
          setErrorMessage(error.response?.data?.message || '更新分數時發生錯誤');
        }
      }
    }
  }, [selectedGame, newScore, searchTerm, updateLeaderboard, setNotification, setErrorMessage]);

  const toggleName = (playerName) => {
    setShowRealName(prev => {
      const newState = { ...prev };
      if (newState[playerName]) {
        // 如果當前玩家正在顯示真名，將其切換回暱稱
        newState[playerName] = false;
      } else {
        // 如果當前玩家正在顯示暱稱，將其切換為真名，並將所有其他玩家切換回暱稱
        Object.keys(newState).forEach(key => {
          newState[key] = false;
        });
        newState[playerName] = true;
      }

      // 更新搜索框
      if (searchTerm === currentPlayerName || searchTerm === currentPlayerNickname) {
        setSearchTerm(newState[playerName] ? currentPlayerName : currentPlayerNickname);
      }

      return newState;
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-gray-100 min-h-screen py-12 flex justify-center"
    >
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <h1 className="text-4xl font-bold text-center text-white">遊戲排行榜</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-8 flex flex-wrap justify-center">
              {games.map((game) => (
                <motion.button
                  key={game}
                  className={`px-4 py-2 m-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedGame === game 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleGameSelect(game)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {game}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isOpen && selectedGame && leaderboardData[selectedGame] && (
            <motion.div
              key={selectedGame}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{selectedGame} 排行榜</h2>
                
                <form onSubmit={handleScoreSubmit} className="mb-4 flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="搜索或輸入玩家名稱"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="分數"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    className="w-24 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FaPlusCircle />
                  </button>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full font-mono">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-1/4">排名</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-1/2">玩家</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-1/4">分數</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.slice(0, showAll ? undefined : 10).map((player, index) => (
                        <tr
                          key={index}
                          className={`${player.rank && player.rank <= 3 ? 'bg-blue-50' : 'bg-white'} cursor-pointer hover:bg-gray-100`}
                          onClick={() => handlePlayerClick(player)}
                        >
                          <td className="px-4 py-4 whitespace-nowrap w-1/4">
                            <div className="flex items-center justify-center">
                              {player.rank ? (
                                player.rank <= 3 ? (
                                  <FaTrophy className={`text-2xl ${getMedalColor(player.rank)}`} />
                                ) : (
                                  <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                                    {player.rank.toString().padStart(3, ' ')}
                                  </span>
                                )
                              ) : (
                                <span className="text-sm text-gray-500">無</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 w-1/2 text-center">
                            <div className="text-sm font-medium text-gray-900 flex items-center justify-center">
                              {player.nickname ? (
                                <>
                                  <span>{showRealName[player.name] ? player.name : player.nickname}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleName(player.name);
                                    }}
                                    className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    {showRealName[player.name] ? '顯示暱稱' : '顯示真名'}
                                  </button>
                                </>
                              ) : (
                                player.name
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center w-1/4">
                            <div className="text-sm font-semibold text-gray-900">{player.score.toString().padStart(4, ' ')}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredData.length > 10 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {showAll ? (
                        <>
                          收起 <FaChevronUp className="ml-2" />
                        </>
                      ) : (
                        <>
                          查看更多 <FaChevronDown className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 懸浮通知 */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 錯誤對話框 */}
        {errorMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">錯誤</h3>
                <button onClick={() => setErrorMessage(null)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default LeaderBoard;

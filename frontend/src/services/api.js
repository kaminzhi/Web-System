import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器，為每個請求添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 用戶認證
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

// 玩家管理
export const getPlayers = async () => {
  const response = await api.get('/players');
  return response.data;
};

export const importPlayers = async (players) => {
  const response = await api.post('/players/import', { players });
  return response.data;
};

// 分數管理
export const updateScore = async (playerId, gameId, score) => {
  const response = await api.post('/scores/update', { playerId, gameId, score });
  return response.data;
};

export const getPlayerScores = async (playerId) => {
  const response = await api.get(`/scores/player/${playerId}`);
  return response.data;
};

// 排行榜
export const getLeaderboard = async (gameId) => {
  const response = await api.get(`/scores/leaderboard/${gameId}`);
  return response.data;
};

// 遊戲管理
export const getGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const createGame = async (gameName) => {
  const response = await api.post('/games', { name: gameName });
  return response.data;
};

// 用戶管理（僅限管理員）
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUserRole = async (userId, isAdmin) => {
  const response = await api.put(`/users/${userId}/role`, { isAdmin });
  return response.data;
};

// 錯誤處理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 伺服器回應的錯誤
      console.error('API 錯誤:', error.response.data);
      if (error.response.status === 401) {
        // 未授權，可能是 token 過期
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // 請求未收到回應
      console.error('無法連接到伺服器');
    } else {
      // 其他錯誤
      console.error('錯誤:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

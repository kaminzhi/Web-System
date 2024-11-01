function validateEnv() {
  const requiredEnvVars = [
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'GAME_NAMES',
    'GAME_DISPLAY_NAMES'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // 驗證遊戲名稱和顯示名稱數量是否匹配
  const gameNames = process.env.GAME_NAMES.split(',');
  const gameDisplayNames = process.env.GAME_DISPLAY_NAMES.split(',');
  
  if (gameNames.length !== gameDisplayNames.length) {
    throw new Error('GAME_NAMES and GAME_DISPLAY_NAMES must have the same number of items');
  }
}

module.exports = validateEnv; 
const { Pool } = require('pg');

const initializeDatabase = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  let retries = 5;
  while (retries) {
    try {
      await pool.query('SELECT NOW()');
      break;
    } catch (err) {
      console.log('Database not ready yet, retrying in 5 seconds...');
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (retries === 0) {
    console.error('Unable to connect to the database after multiple attempts');
    process.exit(1);
  }

  try {
    await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
  } catch (err) {
    if (err.code !== '42P04') {  // 42P04 是數據庫已存在的錯誤代碼
      console.error('Error creating database:', err);
    }
  }

  await pool.end();

  const newPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  const gameNames = ['game1', 'game2', 'game3', 'game4', 'game5', 'game6'];

  for (const gameName of gameNames) {
    try {
      await newPool.query(`
        CREATE TABLE IF NOT EXISTS ${gameName} (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          score INTEGER NOT NULL DEFAULT 0,
          nickname VARCHAR(100)
        )
      `);
      console.log(`Table ${gameName} created or already exists.`);

      // 如果表已存在，添加 nickname 列並刪除 anonymous 列
      await newPool.query(`
        DO $$ 
        BEGIN 
          BEGIN
            ALTER TABLE ${gameName} ADD COLUMN nickname VARCHAR(100);
          EXCEPTION
            WHEN duplicate_column THEN NULL;
          END;
          
          BEGIN
            ALTER TABLE ${gameName} DROP COLUMN IF EXISTS anonymous;
          EXCEPTION
            WHEN undefined_column THEN NULL;
          END;
        END $$;
      `);
      console.log(`Table ${gameName} updated with nickname column.`);
    } catch (err) {
      console.error(`Error updating table ${gameName}:`, err);
    }
  }

  await newPool.end();
};

module.exports = initializeDatabase;

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 定義路由...

// POST 路由來搜索特定遊戲的玩家分數
router.post('/search', async (req, res) => {
  try {
    const { gameName } = req.body;

    // 首先檢查表格是否存在
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    const tableExists = await pool.query(tableCheckQuery, [gameName]);

    if (!tableExists.rows[0].exists) {
      return res.status(404).json({ message: '找不到該遊戲表格' });
    }

    // 如果表格存在,查詢玩家分數和暱稱
    const query = `
      SELECT name, score, nickname
      FROM ${gameName} 
      ORDER BY score DESC
    `;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// 新增路由: 獲取所有遊戲的前三名
router.get('/top3', async (req, res) => {
  try {
    // 首先獲取所有遊戲表格
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'game%'
    `;
    const tables = await pool.query(tablesQuery);

    const results = {};

    // 對每個表格執行查詢
    for (const table of tables.rows) {
      const gameName = table.table_name;
      const query = `
        SELECT 
          DENSE_RANK() OVER (ORDER BY score DESC) as dense_rank,
          RANK() OVER (ORDER BY score DESC) as rank,
          ROW_NUMBER() OVER (ORDER BY score DESC) as row_number,
          name, 
          score,
          nickname
        FROM ${gameName} 
        ORDER BY score DESC
        LIMIT 3
      `;
      const result = await pool.query(query);
      results[gameName] = result.rows;
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// 修改更新分數的路由
router.put('/update-score', async (req, res) => {
  try {
    const { gameName, playerName, nickname, newScore } = req.body;

    // 檢查表格是否存在
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    const tableExists = await pool.query(tableCheckQuery, [gameName]);

    if (!tableExists.rows[0].exists) {
      return res.status(404).json({ message: '找不到該遊戲表格' });
    }

    let updateQuery;
    let queryParams;

    if (playerName === "null") {
      // 如果 playerName 為 "null"，使用暱稱來更新
      updateQuery = `
        UPDATE ${gameName}
        SET score = $1
        WHERE nickname = $2
        RETURNING *
      `;
      queryParams = [newScore, nickname];
    } else {
      // 否則使用玩家名稱來更新
      updateQuery = `
        UPDATE ${gameName}
        SET score = $1
        WHERE name = $2
        RETURNING *
      `;
      queryParams = [newScore, playerName];
    }

    const result = await pool.query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '找不到該玩家' });
    }

    res.json({ message: '分數更新成功', updatedPlayer: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// 新增路由: 將新成員加入到所有遊戲中
router.post('/add-member', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { name, nickname } = req.body;

    if (!name) {
      return res.status(400).json({ message: '名字不能為空' });
    }

    // 獲取所有遊戲表格
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'game%'
    `;
    const tables = await client.query(tablesQuery);

    // 檢查所有表格中是否存在重名
    for (const table of tables.rows) {
      const gameName = table.table_name;
      const checkQuery = `
        SELECT COUNT(*) FROM ${gameName} WHERE name = $1
      `;
      const checkResult = await client.query(checkQuery, [name]);
      
      if (checkResult.rows[0].count > 0) {
        throw new Error(`上傳失敗：玩家 ${name} 已存在於遊戲 ${gameName} 中`);
      }
    }

    // 如果沒有重名，則插入新成員到所有遊戲中
    const results = [];
    for (const table of tables.rows) {
      const gameName = table.table_name;
      const insertQuery = `
        INSERT INTO ${gameName} (name, score, nickname)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await client.query(insertQuery, [name, 0, nickname || null]);
      results.push({ game: gameName, player: result.rows[0] });
    }

    await client.query('COMMIT');

    res.status(201).json({ 
      message: '成員成功加入所有遊戲', 
      results 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;

const express = require('express');
const { Pool } = require('pg');
const app = express();
const router = express.Router();
require('dotenv').config();

// 创建一个 PostgreSQL 数据库连接池
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });


  pool.connect()
  .then(() => console.log('Successfully connected to PostgreSQL!'))
  .catch(err => console.error('Error establishing connection to PostgreSQL:', err));
  router.get('/data', async (req, res) => {
    try {
        const query = `
        SELECT ST_X(coordinate) as longitude, ST_Y(coordinate) as latitude
        FROM station
        ORDER BY RANDOM()
        LIMIT 1000000
        `;
        const result = await pool.query(query);
        const data = result.rows.map(row => [row.longitude, row.latitude]);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

  
module.exports = router;
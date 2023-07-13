const express = require('express');
const { Client } = require('pg');

const app = express();
const router = express.Router();
require('dotenv').config();
// 创建一个 PostgreSQL 数据库连接池
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
   
  client.connect() // 连接在此处完成
  .catch(err => console.error('Error establishing connection to PostgreSQL:', err));
  
  router.get('/data', async (req, res) => {
    try {
      const query = 'SELECT ST_X(geom) AS longitude, ST_Y(geom) AS latitude FROM random_points;';
      const result = await client.query(query);
  
      res.status(200).send(result.rows);
    } catch (err) {
      console.error('Error retrieving random points:', err);
      res.status(500).send({ error: 'An error occurred while retrieving data' });
    }
  });
  
module.exports = router;
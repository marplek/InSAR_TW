const express = require('express');
const { Client } = require('pg');
const {InfluxDB} = require('@influxdata/influxdb-client');
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



  const token = "gWlTj6StNBP9OGIeLCMYjt9PJ9W8wvPGutDgl-tVuS6r9uYX9KLXEWhD2PTAppJdRaOdThu69gwJhdWKYPyWoQ==";
  const org = "insartw";
  const bucket = "test5";
  const influxdb = new InfluxDB({url: 'http://influxdb:8086', token: token});

  client.connect() // 连接在此处完成
  .catch(err => console.error('Error establishing connection to PostgreSQL:', err));
  
  router.get('/sta', async (req, res) => {
    try {
      const query = 'SELECT id, ST_X(geom) AS longitude, ST_Y(geom) AS latitude FROM random_points;';
      const result = await client.query(query);
  
      res.status(200).send(result.rows);
    } catch (err) {
      console.error('Error retrieving random points:', err);
      res.status(500).send({ error: 'An error occurred while retrieving data' });
    }
  });

  router.get('/data/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
  
    const queryApi = influxdb.getQueryApi(org);
  
    const fluxQuery = `from(bucket: "${bucket}") |> range(start: -1y) |> filter(fn: (r) => r["id"] == "${id}")`;
  
    const result = await queryApi.collectRows(fluxQuery);
    
    res.send(result);
  });
  
module.exports = router;
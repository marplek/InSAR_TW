const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());



// // You can generate an API token from the "API Tokens Tab" in the UI
// const token = 'N2s8OKCOTt9_PmbabIHwmvjSpSqjsXhV5S1ayKS9T0E06OGSqdlmC-iE6zvvDkI1IJE-iwaiEgnmWQ_13ShqXw=='
// const org = 'ies'
// const bucket = 'test'

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
 
client.connect();

app.get('/data', async (req, res) => {
  client.query('SELECT id, ST_Y(geom) as latitude, ST_X(geom) as longitude FROM taiwan_points', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      console.log(result.rows)
      res.status(200).send(result.rows);
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());



// // You can generate an API token from the "API Tokens Tab" in the UI
// const token = 'N2s8OKCOTt9_PmbabIHwmvjSpSqjsXhV5S1ayKS9T0E06OGSqdlmC-iE6zvvDkI1IJE-iwaiEgnmWQ_13ShqXw=='
// const org = 'ies'
// const bucket = 'test'

const client = new Client({
  user: 'postgres',
  host: '172.104.93.218',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
})
 
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

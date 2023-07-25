const express = require('express');

const cors = require('cors');
require('dotenv').config();
const staRouter = require('./routes/sta');
var { expressjwt: jwt } = require("express-jwt");
const loginRouter = require('./routes/login');  // 導入登入路由

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(
  jwt({
      secret: process.env.JWT_SECRET,
      algorithms: ["HS256"]
  }).unless({ path: ["/api/login"] })
);
app.use('/api', staRouter);
app.use('/api', loginRouter);  // 使用登入路由

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

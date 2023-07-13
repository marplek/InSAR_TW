const express = require('express');

const cors = require('cors');
require('dotenv').config();
const staRouter = require('./routes/sta');

const app = express();
app.use(cors());





app.use('/api', staRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

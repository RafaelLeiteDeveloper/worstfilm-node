// src/app.js
const express = require('express');

const movieController = require('./controllers/MovieController');

const app = express();
const PORT = 8090;

app.use(express.json());
app.use('/', movieController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 

const express = require('express');
const movieService = require('../services/movieService');
const { MovieProcessor } = require('../services/movieService'); // Importe MovieProcessor diretamente


const router = express.Router();

router.get('/movie/search/winners/interval', async (req, res) => {
  try {
    const movieProcessor = new MovieProcessor(); // Crie uma instância de MovieProcessor
    const result = await movieProcessor.findMinAndMax();
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

const express = require('express');
const movieService = require('../services/movieService');

const router = express.Router();

router.get('/movie/search/winners/interval', async (req, res) => {
  try {
    const result = await movieService.MovieProcessor.findMinAndMax();
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

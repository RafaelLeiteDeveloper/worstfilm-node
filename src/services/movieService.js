const movieRepository = require('../repositories/MovieRepository');

const movieService = {
  findWinnersInterval: async () => {
    try {
      const movies = await movieRepository.findAll(); 
      const winners = movies.filter(movie => movie.winner === 'yes');
      const producersMap = new Map();

      winners.forEach(movie => {
        const producers = movie.producers.toLowerCase().split('and').map(producer => producer.trim());

        producers.forEach(producer => {
          if (producersMap.has(producer)) {
            const existingProducer = producersMap.get(producer);
            const year = parseInt(movie.year);
            
            if (year - existingProducer.maxYear <= 1) {
              // Se sim, verificar se ganhou junto com outro produtor
              const hasJointWin = movie.producers.toLowerCase().includes(',') && movie.producers.toLowerCase().split(',').map(p => p.trim()).some(p => producers.includes(p) && p !== producer);
              if (!hasJointWin) {
                existingProducer.maxYear = year;
                existingProducer.movies.push(movie);
              }
            }
          } else {
            producersMap.set(producer, {
              minYear: parseInt(movie.year),
              maxYear: parseInt(movie.year),
              movies: [movie]
            });
          }
        });
      });

      let minIntervalProducer = null;
      let minInterval = Infinity;
      for (const [producer, data] of producersMap.entries()) {
        const interval = data.maxYear - data.minYear;
        if (interval >= 1 && interval < minInterval) {
          minIntervalProducer = {
            producer,
            interval,
            previousWin: data.minYear,
            followingWin: data.maxYear,
          };
          minInterval = interval;
        }
      }

      const producersWithInterval = winners.flatMap(movie => {
        const producers = movie.producers.toLowerCase().split(',').map(producer => producer.trim());
        const years = producers.map(producer => {
          const producerMovies = winners.filter(movie => movie.producers.toLowerCase().split(',').map(producer => producer.trim()).includes(producer));
          return producerMovies.map(movie => parseInt(movie.year));
        });
        return producers.map((producer, index) => ({
          producer,
          interval: Math.max(...years[index]) - Math.min(...years[index]),
          previousWin: Math.min(...years[index]),
          followingWin: Math.max(...years[index]),
        }));
      });

      const maxIntervalProducer = producersWithInterval.reduce(
        (max, current) => current.interval > max.interval ? current : max,
        { interval: 0 } 
      );

      return { 
        min: minIntervalProducer ? [minIntervalProducer] : [], 
        max: maxIntervalProducer ? [maxIntervalProducer] : [] 
      };
      
    } catch (error) {
      throw new Error(`Error finding winners interval: ${error.message}`);
    }
  }
};

module.exports = movieService;

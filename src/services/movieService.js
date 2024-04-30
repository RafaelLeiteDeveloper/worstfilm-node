const movieRepository = require('../repositories/MovieRepository');

class ProducerDTO {
  constructor(producer, interval, previousWin, followingWin) {
      this.producer = producer;
      this.interval = interval;
      this.previousWin = previousWin;
      this.followingWin = followingWin;
  }
}

class ProducerData {
  constructor(min, max) {
      this.min = min;
      this.max = max;
  }
}

class ProducersIntervalDTO {
  constructor(interval, previousWin, followingWin) {
      this.interval = interval;
      this.previousWin = previousWin;
      this.followingWin = followingWin;
  }
}

class MovieProcessor {

  async findMinAndMax() {
      console.log('aqui')
      const films = await movieRepository.findAll(); 
      const updatedFilms = this.separateFilmsWithMultipleProducers(films);
      this.calculateMaxDistanceEachProducer(updatedFilms);
      return this.printUpdatedFilmsList(updatedFilms);
  }

  separateFilmsWithMultipleProducers(films) {
      const producersMap = this.createProducersMap(films);
      return this.createProducersYearsDTOList(producersMap);
  }

  calculateMaxDistanceEachProducer(films) {
      for (const producer of films) {
          const years = producer.years;
          if (years.length > this.MIN_INTERVAL) {
              this.calculateMaxDistanceForProducer(years, producer);
          }
      }
  }

  calculateMaxDistanceForProducer(years, producer) {
      years.sort((a, b) => a - b);

      for (let i = 0; i < years.length - 1; i++) {
          const currentYear = years[i];
          const nextYear = years[i + 1];
          const interval = nextYear - currentYear;

          producer.interval.push(new ProducersIntervalDTO(interval, currentYear, nextYear));
      }

      producer.intervalMax = this.getMaxInterval(producer.interval);
      producer.intervalMin = this.getMinInterval(producer.interval);
  }

  getExtremeInterval(producers, comparator) {
      const extremeInterval = producers
          .map(p => p.interval)
          .sort(comparator)[0];

      if (!extremeInterval) {
          return [];
      }

      return producers.filter(p => p.interval === extremeInterval);
  }

  getMaxInterval(producers) {
      return this.getExtremeInterval(producers, (a, b) => b - a);
  }

  getMinInterval(producers) {
      return this.getExtremeInterval(producers, (a, b) => a - b);
  }

  createProducersMap(films) {
      const producersMap = new Map();

      films.forEach(film => {
          const producers = film.producers.split(/, | and |, and /);
          for (const producer of producers) {
              const producerName = producer.trim().replace("and", "").trim();
              if (!producersMap.has(producerName)) {
                  producersMap.set(producerName, []);
              }
              producersMap.get(producerName).push(film.year);
          }
      });

      return producersMap;
  }

  createProducersYearsDTOList(producersMap) {
      const updatedFilms = [];

      for (const [producer, years] of producersMap.entries()) {
          updatedFilms.push({
              producer: producer,
              years: years,
              interval: [],
              intervalMax: [],
              intervalMin: []
          });
      }

      return updatedFilms;
  }

  printUpdatedFilmsList(films) {
      const maxDistanceDTOS = [];
      const minDistanceDTOS = [];

      for (const obj of films) {
          for (const min of obj.intervalMax) {
              maxDistanceDTOS.push(new ProducerDTO(obj.producer, min.interval, min.previousWin, min.followingWin));
          }
      }

      for (const obj of films) {
          for (const min of obj.intervalMin) {
              minDistanceDTOS.push(new ProducerDTO(obj.producer, min.interval, min.previousWin, min.followingWin));
          }
      }

      return new ProducerData(this.getProducersWithMinInterval(minDistanceDTOS), this.getProducersWithMaxInterval(maxDistanceDTOS));
  }

  getProducersWithMinInterval(producersList) {
      const minInterval = this.findMinInterval(producersList);
      return this.filterProducersByInterval(producersList, minInterval);
  }

  getProducersWithMaxInterval(producersList) {
      const maxInterval = this.findMaxInterval(producersList);
      return this.filterProducersByInterval(producersList, maxInterval);
  }

  findMinInterval(producersList) {
      let min = Number.MAX_SAFE_INTEGER;
      for (const producer of producersList) {
          min = Math.min(min, producer.interval);
      }
      return min;
  }

  findMaxInterval(producersList) {
      let max = Number.MIN_SAFE_INTEGER;
      for (const producer of producersList) {
          max = Math.max(max, producer.interval);
      }
      return max;
  }

  filterProducersByInterval(producersList, interval) {
      return producersList.filter(producer => producer.interval === interval);
  }
}

module.exports = {
  ProducerDTO,
  ProducerData,
  ProducersIntervalDTO,
  MovieProcessor
};

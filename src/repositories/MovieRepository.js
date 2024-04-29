const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const fs = require('fs');

const movieRepository = {
  clearTable: async () => {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(':memory:');

      db.serialize(() => {
        db.run("DROP TABLE IF EXISTS movies", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  },

  findAll: async () => {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(':memory:');

      db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS movies (year TEXT, title TEXT, studios TEXT, producers TEXT, winner TEXT)");

        fs.createReadStream('src/data/movies.csv')
          .pipe(csv({ separator: ';' }))
          .on('data', (row) => {
            db.run("INSERT INTO movies VALUES (?, ?, ?, ?, ?)", [row.year, row.title, row.studios, row.producers, row.winner]);
          })
          .on('end', () => {
            db.all("SELECT * FROM movies", (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            });
            db.close();
          });
      });
    });
  }
};

module.exports = movieRepository;
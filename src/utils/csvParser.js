// src/utils/csvParser.js
const csv = require('csv-parser');
const fs = require('fs');

const csvParser = {
  parseCsvFile: async (filePath) => {
    const data = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
};

module.exports = csvParser;

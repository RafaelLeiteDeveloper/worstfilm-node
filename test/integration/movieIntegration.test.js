const app = require('../../src/app');
const request = require('supertest')(app);

describe('GET /', () => {
  it('responds with JSON containing a message indicating the server is running', async () => {
    const response = await request
      .get('/movie/search/winners/interval')
      .expect('Content-Type', /json/) 
      .expect(200);

    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
  });
});

describe('GET /movie/search/winners/interval', () => {
    it('responds with an error message when the route does not exist', async () => {
      const response = await request
        .get('/invalid-route') // Altera o caminho da rota para algo inexistente
        .expect(404); // Espera que a rota inexistente retorne um status 404

    });
  });
/* eslint-disable jest/expect-expect */
describe('Home route', () => {
  test('home redirects to /browse', async () => {
    const app = require('express')();
    const request = require('supertest');
    const home = require('../../../main/routes/home').default;
    home(app);
    const response = await request(app).get('/');
    expect(response.status).toEqual(302);
    expect(response.header.location).toEqual('/browse');
  });
});

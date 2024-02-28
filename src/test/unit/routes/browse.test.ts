/* eslint-disable jest/expect-expect */
import { Nunjucks } from '../../../main/modules/nunjucks';

describe('Browse route', () => {
  test('browse renders the browse template', async () => {
    jest.setTimeout(30000); // seems to be a slow page in tests for some reason
    const app = require('express')();
    new Nunjucks(false).enableFor(app);

    const request = require('supertest');
    const browse = require('../../../main/routes/browse').default;
    browse(app);
    const response = await request(app).get('/browse');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Recordings shared with you');
  });
});

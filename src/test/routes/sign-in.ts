import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';

/* eslint-disable jest/expect-expect */
describe('Sign in page', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/sign-in')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
  describe('on POST', () => {
    test('should return 302 redirect to browse', async () => {
      await request(app)
        .post('/sign-in')
        .expect(res => expect(res.status).to.equal(302));
    });
  });
});

import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';

/* eslint-disable jest/expect-expect */
describe('Sign in page', () => {
  describe('on GET', () => {
    test('should return 302', async () => {
      await request(app)
        .get('/sign-in')
        .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.include('.b2clogin.com');
        });
    });
  });
});

import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';

/* eslint-disable jest/expect-expect */
describe('Sign out page', () => {
  describe('on GET', () => {
    test('should return 302', async () => {
      await request(app)
        .get('/sign-out')
        .expect(res => expect(res.status).to.equal(302));
    });
  });
});

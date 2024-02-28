import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';
import { mock, reset } from '../mock-api';

/* eslint-disable jest/expect-expect */
describe('Watch page success', () => {
  describe('on GET', () => {
    test('should return 302', async () => {
      mock();
      await request(app)
        .get('/watch/something')
        .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.include('.b2clogin.com');
        });
    });
  });
});

beforeEach(() => {
  reset();
});

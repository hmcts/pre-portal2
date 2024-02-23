import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';
import { mock, reset } from '../mock-api';

/* eslint-disable jest/expect-expect */
describe('Browse page success', () => {
  describe('on GET', () => {
    test('should return 302', async () => {
      mock();
      await request(app)
        .get('/browse')
        .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.include('.b2clogin.com');
        });
    });
  });
});

/* eslint-disable jest/expect-expect */
describe('Browse page failure', () => {
  describe('on GET', () => {
    test('should return 500', async () => {
      await request(app)
        .get('/browse')
        .expect(res => expect(res.status).to.equal(500));
    });
  });
});

beforeEach(() => {
  reset();
});

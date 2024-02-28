import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';
import { mock, reset } from '../mock-api';

/* eslint-disable jest/expect-expect */
describe('Watch page success', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      mock();
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});

/* eslint-disable jest/expect-expect */
describe('Watch page failure', () => {
  describe('on GET', () => {
    test('should return 500', async () => {
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(500));
    });
  });
});

beforeEach(() => {
  reset();
});

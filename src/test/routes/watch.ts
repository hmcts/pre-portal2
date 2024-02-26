import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';
import { mock, reset } from '../mock-api';

/* eslint-disable jest/expect-expect */
describe('Watch page 500 error', () => {
  describe('on GET', () => {
    test('should return 500', async () => {
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(500));
    });
  });
});

/* eslint-disable jest/expect-expect */
describe('Watch page', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      mock();
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});

beforeEach(() => {
  reset();
});

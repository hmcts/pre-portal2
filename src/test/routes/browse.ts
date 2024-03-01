import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';
import { mock, reset, mockGetRecordings } from '../mock-api';
import { PreClient } from '../../main/services/pre-api/pre-client';

/* eslint-disable jest/expect-expect */
describe('Browse page success', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      mock();
      await request(app)
        .get('/browse')
        .expect(res => expect(res.status).to.equal(200));
    });
    test('should return 200 when no recordings are returned', async () => {
      mockGetRecordings([]);
      await request(app)
        .get('/browse')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});

/* eslint-disable jest/expect-expect */
describe('Browse page failure', () => {
  describe('on GET', () => {
    test('should return 500', async () => {
      jest.spyOn(PreClient.prototype, 'getRecordings').mockImplementation(() => {
        throw new Error('error');
      });

      await request(app)
        .get('/browse')
        .expect(res => expect(res.status).to.equal(500));
    });
  });
});

beforeEach(() => {
  reset();
});

import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';

/* eslint-disable jest/expect-expect */
describe('Terms and Conditions page', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/terms-and-conditions')
        .expect(res => {
          expect(res.status).to.equal(200);
          expect(res.text).to.include('Terms &amp; Conditions');
        });
    });
  });
});

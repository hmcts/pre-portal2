import { app } from '../../main/app';

import request from 'supertest';

/* eslint-disable jest/expect-expect */
describe('Terms and Conditions page', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/terms-and-conditions')
        .expect(res => {
          expect(res.status).toBe(200);
          expect(res.text).toContain('Terms &amp; Conditions');
        });
    });
  });
});

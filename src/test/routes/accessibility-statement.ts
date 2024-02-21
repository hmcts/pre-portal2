import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';

/* eslint-disable jest/expect-expect */
describe('Accessibility Statement page', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/accessibility-statement')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});

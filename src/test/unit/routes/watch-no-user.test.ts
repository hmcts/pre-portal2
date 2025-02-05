/* eslint-disable jest/expect-expect */
import { Nunjucks } from '../../../main/modules/nunjucks';
import { reset } from '../../mock-api';
import { beforeAll, describe } from '@jest/globals';
import { mockNoUser } from '../test-helper';

mockNoUser();

describe('Watch page failure', () => {
  beforeAll(() => {
    reset();
  });

  describe('on GET', () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');

    const watch = require('../../../main/routes/watch').default;
    watch(app);

    test('should return 404 run getting user id fails', async () => {
      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ab')
        .expect(res => expect(res.status).toBe(404));

      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ab/playback')
        .expect(res => expect(res.status).toBe(404));
    });
  });
});

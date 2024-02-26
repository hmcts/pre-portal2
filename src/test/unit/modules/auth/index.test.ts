/* eslint-disable jest/expect-expect */

import { Auth } from '../../../../main/modules/auth';
import { config } from '../../../config';

describe('Auth Module', () => {
  test('test redis config is loaded when there is a redisHost', async () => {
    const app = require('express')();
    const auth = new Auth();
    config.session.redis.host = 'http://localhost:6379';
    config.session.redis.key = 'rediskey';
    auth.enableFor(app);
  });
});

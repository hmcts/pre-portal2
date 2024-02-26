/* eslint-disable jest/expect-expect */

import { Auth } from '../../../../main/modules/auth';
import config from 'config';
import { set } from 'lodash';

describe('Auth Module', () => {
  test('test redis config is loaded when there is a redisHost', async () => {
    const app = require('express')();
    const auth = new Auth();
    set(config, 'session.redis.host', 'http://localhost:6379');
    set(config, 'session.redis.key', 'rediskey');
    set(config, 'b2c.appClientSecret', 'appClientSecret');
    auth.enableFor(app);
    expect(app.locals.redisClient).toBeDefined();
  });
});

/* eslint-disable jest/expect-expect */

import { Auth } from '../../../../main/modules/auth';
import config from 'config';
import { set } from 'lodash';
import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import { OpenidRequest, OpenidResponse, Session } from 'express-openid-connect';

jest.mock('axios');
jest.mock('jose', () => {
  return {
    decodeJwt: jest.fn().mockImplementation((s: string) => {
      return { email: 'test@testy.com' };
    }),
  };
});

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

  test('Checks if a user is newly invited during callback', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    // @ts-ignore
    mockedAxios.get.mockImplementation((url: string, config: object) => {
      if (url === '/invites' && config['params']['email'] === 'test@testy.com') {
        return Promise.resolve({
          status: 200,
          data: {
            page: {
              size: 20,
              totalElements: 1,
              totalPages: 1,
              number: 0,
            },
          },
        });
      }
      if (url === '/users/by-email/test@testy.com') {
        return Promise.resolve({
          status: 200,
          data: [
            {
              id: '123',
              court: {
                id: '123',
                name: 'Test',
                court_type: 'Test',
                location_code: 'Test',
                regions: [
                  {
                    name: 'Test',
                  },
                ],
                rooms: [],
              },
              role: {
                id: 'Test',
                name: 'Test',
                description: 'Test',
                permissions: [],
              },
              last_access: null,
              active: true,
              user: {
                id: 'Test',
                first_name: 'Test',
                last_name: 'Test',
                email: 'test@testy.com',
                phone_number: null,
                organisation: null,
              },
            },
          ],
        });
      }
    });
    // @ts-ignore
    mockedAxios.post.mockImplementation((url: string, config: object) => {
      if (url === '/invites/redeem/test@testy.com') {
        return Promise.resolve({
          status: 200,
          data: {},
        });
      }
    });
    const app = require('express')();
    const auth = new Auth();
    const logger = Logger.getLogger('auth-module-test');
    const configParams = auth['getConfigParams'](app, logger);
    // @ts-ignore
    const result = await configParams['afterCallback']({} as OpenidRequest, {} as OpenidResponse, {} as Session, {});
    expect(result.userProfile.user.email).toBe('test@testy.com');
  });
});

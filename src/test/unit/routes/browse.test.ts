/* eslint-disable jest/expect-expect */
import { Nunjucks } from '../../../main/modules/nunjucks';
import { mock, reset } from '../../mock-api';
import { beforeAll } from '@jest/globals';

jest.mock('express-openid-connect', () => {
  return {
    requiresAuth: jest.fn().mockImplementation(() => {
      return (req: any, res: any, next: any) => {
        next();
      };
    }),
  };
});
jest.mock('../../../main/services/session-user/session-user', () => {
  return {
    SessionUser: {
      getLoggedInUser: jest.fn().mockImplementation((req: Express.Request) => {
        return {
          id: '123',
        };
      }),
    },
  };
});
describe('Browse route', () => {
  beforeAll(() => {
    reset();
  });

  test('browse renders the browse template', async () => {
    jest.setTimeout(30000); // seems to be a slow page in tests for some reason
    const app = require('express')();
    new Nunjucks(false).enableFor(app);

    mock();

    const request = require('supertest');
    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Recordings shared with you');
  });
});

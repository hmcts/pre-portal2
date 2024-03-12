/* eslint-disable jest/expect-expect */
import { Nunjucks } from '../../../main/modules/nunjucks';
import { mockGetRecordings, reset } from '../../mock-api';
import { beforeAll } from '@jest/globals';
import { expect } from 'chai';
import { PreClient } from '../../../main/services/pre-api/pre-client';

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
    const request = require('supertest');
    mockGetRecordings([]);

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse');
    expect(response.status).equal(200);
    expect(response.text).contain('Recordings');
    expect(response.text).contain('Welcome back,');
    expect(response.text).contain('playback is preferred on non-mobile devices');
    expect(response.text).contain('<a href="/logout" class="govuk-back-link">Sign out</a>');
  });

  test('should return 500', async () => {
    jest.spyOn(PreClient.prototype, 'getRecordings').mockImplementation(() => {
      throw new Error('error');
    });

    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse');
    expect(response.status).equal(500);
  });
});

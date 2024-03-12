/* eslint-disable jest/expect-expect */
import { Nunjucks } from '../../../main/modules/nunjucks';
import { mockGetRecordings, reset, mockRecordings } from '../../mock-api';
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

  test('pagination should have a previous link', async () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');
    const recordings = Array(12).fill(mockRecordings[0]).flat();

    mockGetRecordings(recordings, 1);

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse?page=1');
    expect(response.status).equal(200);
    expect(response.text).contain('<span class="govuk-pagination__link-title">Previous');
  });

  test('pagination should have a next link', async () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');
    const recordings = Array(12).fill(mockRecordings[0]).flat();

    mockGetRecordings(recordings, 0);

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse?page=0');
    expect(response.status).equal(200);
    expect(response.text).contain('<span class="govuk-pagination__link-title">Next');
  });

  test('pagination should have a filler ellipsis when more than 2 pages from the start', async () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');
    const recordings = Array(50).fill(mockRecordings[0]).flat();

    mockGetRecordings(recordings, 4);

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse?page=4');
    expect(response.status).equal(200);
    expect(response.text).contain('<li class="govuk-pagination__item govuk-pagination__item--ellipses">&ctdot;</li>');
  });

  test('pagination should have a filler ellipsis when more than 2 pages from the end', async () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');
    const recordings = Array(50).fill(mockRecordings[0]).flat();

    mockGetRecordings(recordings, 0);

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse?page=0');
    expect(response.status).equal(200);
    expect(response.text).contain('<li class="govuk-pagination__item govuk-pagination__item--ellipses">&ctdot;</li>');
  });

  test('pagination should show 2 pages either side of the current page', async () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');
    const recordings = Array(100).fill(mockRecordings[0]).flat();

    mockGetRecordings(recordings, 4);

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse?page=4');
    const text = response.text.replace(/\s+/g, ' ').trim();
    expect(response.status).equal(200);
    expect(text).contain('> 1 <');
    expect(text).contain('> 3 <');
    expect(text).contain('> 4 <');
    expect(text).contain('> 5 <');
    expect(text).contain('> 6 <');
    expect(text).contain('> 7 <');
    expect(text).contain('> 10 <');
  });

  test('heading should contain current page, max page and number of recordings', async () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');
    const recordings = Array(100).fill(mockRecordings[0]).flat();

    mockGetRecordings(recordings, 4);

    const browse = require('../../../main/routes/browse').default;
    browse(app);

    const response = await request(app).get('/browse?page=4');
    expect(response.status).equal(200);
    expect(response.text).contain('Recordings 41 to 50 of 100');
  });
});

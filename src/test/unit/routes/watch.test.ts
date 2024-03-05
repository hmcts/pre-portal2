/* eslint-disable jest/expect-expect */
import { Nunjucks } from '../../../main/modules/nunjucks';
import { mockGetRecording, mockGetRecordingPlaybackData, reset } from '../../mock-api';
import { beforeAll } from '@jest/globals';
import { expect } from 'chai';

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

    test('should return 404 when both api calls fail', async () => {
      mockGetRecording(null);
      mockGetRecordingPlaybackData(null);
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(404));
    });
    test('should return 404 when getRecording fails', async () => {
      mockGetRecording(null);
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(404));
    });
    test('should return 404 when getRecordingPlaybackData fails', async () => {
      mockGetRecording();
      mockGetRecordingPlaybackData(null);
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(404));
    });
  });
});

/* eslint-disable jest/expect-expect */
import { Nunjucks } from '../../../main/modules/nunjucks';
import { mockGetRecording, mockGetRecordingPlaybackData, mockPutAudit, reset } from '../../mock-api';
import { beforeAll, describe } from '@jest/globals';
import { expect } from 'chai';
import { PreClient } from '../../../main/services/pre-api/pre-client';
import { mockeduser } from '../test-helper';

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
      getLoggedInUserPortalId: jest.fn().mockImplementation((req: Express.Request) => {
        return '123';
      }),
      getLoggedInUserProfile: jest.fn().mockImplementation((req: Express.Request) => {
        return mockeduser;
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

    test('should return 404 when getRecording returns null', async () => {
      mockGetRecording(null);
      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ff')
        .expect(res => expect(res.status).to.equal(404));
    });
    test('should return 404 when getRecordingPlaybackData returns null', async () => {
      mockGetRecordingPlaybackData(null);
      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ff/playback')
        .expect(res => expect(res.status).to.equal(404));
    });

    test('should return 404 when getRecording id is invalid', async () => {
      mockGetRecording(null);
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(404));
    });
    test('should return 404 when getRecordingPlaybackData id is invalid', async () => {
      mockGetRecordingPlaybackData(null);
      await request(app)
        .get('/watch/something/playback')
        .expect(res => expect(res.status).to.equal(404));
    });

    test('should return 500 when getRecording fails', async () => {
      jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (xUserId: string, id: string) => {
        throw new Error('Error');
      });
      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ab')
        .expect(res => expect(res.status).to.equal(500));
    });
    test('should return 500 when getRecordingPlaybackData fails', async () => {
      jest
        .spyOn(PreClient.prototype, 'getRecordingPlaybackData')
        .mockImplementation(async (xUserId: string, id: string) => {
          throw new Error('Error');
        });
      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ab/playback')
        .expect(res => expect(res.status).to.equal(500));
    });
  });
});

describe('Watch page success', () => {
  beforeAll(() => {
    reset();
  });

  describe('on GET', () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');

    const watch = require('../../../main/routes/watch').default;
    watch(app);

    test('should return 200 when getRecording and getRecordingPlaybackData succeed', async () => {
      mockGetRecording();
      mockGetRecordingPlaybackData();
      mockPutAudit();
      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ab')
        .expect(res => expect(res.status).to.equal(200));
      await request(app)
        .get('/watch/12345678-1234-1234-1234-1234567890ab/playback')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});

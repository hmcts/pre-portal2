import { Nunjucks } from '../../../main/modules/nunjucks';
import config from 'config';
import { mockUser } from '../test-helper';
import { set } from 'lodash';
import {
  mockGetCurrentEditRequest,
  mockGetRecording,
  mockGetRecordingPlaybackData,
  mockPutAudit,
  reset,
} from '../../mock-api';
import { describe } from '@jest/globals';
import { PreClient } from '../../../main/services/pre-api/pre-client';

mockUser();
set(config, 'pre.enableAutomatedEditing', 'true');

describe('edit-request route', () => {
  beforeAll(() => {
    reset();
  });

  describe('on GET', () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');

    const watch = require('../../../main/routes/edit-request').default;
    watch(app);

    test('should return 500 when getCurrentEditRequest fails', async () => {
      jest
        .spyOn(PreClient.prototype, 'getMostRecentEditRequests')
        .mockImplementation(async (xUserId: string, sourceRecordingId: string) => {
          throw new Error('Error');
        });
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ab')
        .expect(res => expect(res.status).toBe(500));
    });

    test('should return 500 when calculateTimeRemoved fails', async () => {
      jest
        .spyOn(PreClient.prototype, 'getMostRecentEditRequests')
        .mockImplementation(async (xUserId: string, sourceRecordingId: string) => {
          return [
            {
              id: '123',
              status: 'DRAFT',
              source_recording_id: '12345678-1234-1234-1234-1234567890ab',
              edit_instruction: {
                requestedInstructions: [
                  {
                    start_of_cut: '00:00:00',
                    end_of_cut: '00:00:00',
                  },
                ],
              },
              rejection_reason: '',
            },
          ];
        });
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ab')
        .expect(res => expect(res.status).toBe(500));
    });

    test('should return 404 when getRecording returns null', async () => {
      mockGetRecording(null);
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ff')
        .expect(res => expect(res.status).toBe(404));
    });

    test('should return 404 when getRecordingPlaybackData returns null', async () => {
      mockGetRecordingPlaybackData(null);
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ff/playback')
        .expect(res => expect(res.status).toBe(404));
    });

    test('should return 404 when getRecording id is invalid', async () => {
      mockGetRecording(null);
      await request(app)
        .get('/edit-request/something')
        .expect(res => expect(res.status).toBe(404));
    });

    test('should return 404 when getRecordingPlaybackData id is invalid', async () => {
      mockGetRecordingPlaybackData(null);
      await request(app)
        .get('/edit-request/something/playback')
        .expect(res => expect(res.status).toBe(404));
    });

    test('should return 500 when getRecording fails', async () => {
      jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (xUserId: string, id: string) => {
        throw new Error('Error');
      });
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ab')
        .expect(res => expect(res.status).toBe(500));
    });

    test('should return 500 when getRecordingPlaybackData fails', async () => {
      jest
        .spyOn(PreClient.prototype, 'getRecordingPlaybackDataMk')
        .mockImplementation(async (xUserId: string, id: string) => {
          throw new Error('Error');
        });
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ab/playback')
        .expect(res => expect(res.status).toBe(500));
    });

    test('should return 200 when getRecording and getRecordingPlaybackData succeed', async () => {
      mockGetRecording();
      mockGetRecordingPlaybackData();
      mockPutAudit();
      mockGetCurrentEditRequest();
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ab')
        .expect(res => expect(res.status).toBe(200));
      await request(app)
        .get('/edit-request/12345678-1234-1234-1234-1234567890ab/playback')
        .expect(res => expect(res.status).toBe(200));
    });
  });

  describe('on POST', () => {
    const app = require('express')();
    new Nunjucks(false).enableFor(app);
    const request = require('supertest');

    const watch = require('../../../main/routes/edit-request').default;
    watch(app);

    test('should return 404 when id is invalid', async () => {
      await request(app)
        .post('/edit-request/invalid-id')
        .send({})
        .expect(res => expect(res.status).toBe(404));
    });

    test('should return 500 when putEditRequest fails', async () => {
      jest.spyOn(PreClient.prototype, 'putEditRequest').mockImplementation(async (xUserId: string, body: any) => {
        throw new Error('Error');
      });
      await request(app)
        .post('/edit-request/12345678-1234-1234-1234-1234567890ab')
        .send({})
        .expect(res => expect(res.status).toBe(500));
    });

    test('should return 200 when putEditRequest succeeds', async () => {
      jest.spyOn(PreClient.prototype, 'putEditRequest').mockImplementation(async (xUserId: string, body: any) => {
        return;
      });
      jest
        .spyOn(PreClient.prototype, 'getMostRecentEditRequests')
        .mockImplementation(async (xUserId: string, sourceRecordingId: string) => {
          return [
            {
              id: '123',
              status: 'DRAFT',
              source_recording_id: '12345678-1234-1234-1234-1234567890ab',
              edit_instruction: {
                requestedInstructions: [
                  {
                    start_of_cut: '00:00:00',
                    end_of_cut: '00:00:00',
                  },
                ],
              },
              rejection_reason: '',
            },
          ];
        });
      await request(app)
        .post('/edit-request/12345678-1234-1234-1234-1234567890ab')
        .send({})
        .expect(res => expect(res.status).toBe(200));
    });
  });
});

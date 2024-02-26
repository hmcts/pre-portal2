import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';
import { Recording } from '../../main/services/pre-api/types';
import { PreClient } from '../../main/services/pre-api/pre-client';

jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (id: string) => {
  if (id === 'something') {
    return Promise.resolve({
      id: 'something',
      parentRecordingId: 'parentId',
      version: 1,
      filename: 'filename',
      duration: 'duration',
      editInstructions: 'editInstructions',
      captureSession: {
        id: '',
        bookingId: '',
        origin: '',
        ingestAddress: '',
        liveOutputUrl: '',
        startedAt: '',
        startedByUserId: '',
        finishedAt: '',
        finishedByUserId: '',
        status: '',
        deletedAt: '',
        courtName: '',
      },
      deletedAt: 'deletedAt',
      createdAt: 'createdAt',
      caseReference: 'caseReference',
      isTestCase: false,
      participants: [],
    } as Recording);
  }
  return Promise.resolve(null);
});

/* eslint-disable jest/expect-expect */
describe('Watch page', () => {
  describe('on GET', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/watch/something')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});

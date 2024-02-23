import { app } from '../../main/app';

import { expect } from 'chai';
import request from 'supertest';
import { mock, mockGetRecording, mockGetRecordingPlaybackData, reset } from '../mock-api';

/* eslint-disable jest/expect-expect */
describe('Watch page success', () => {
  describe('on GET', () => {
    test('should return 302', async () => {
      mock();
      await request(app)
        .get('/watch/something')
        .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.include('.b2clogin.com');
        });
    });
  });
});

/* eslint-disable jest/expect-expect */
describe('Watch page failure', () => {
  describe('on GET', () => {
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

beforeEach(() => {
  reset();
});

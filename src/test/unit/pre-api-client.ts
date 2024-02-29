import { mock, reset } from '../mock-api';
import { PreClient } from '../../main/services/pre-api/pre-client';
import { SearchRecordingsRequest } from '../../main/services/pre-api/types';
import { describe } from '@jest/globals';

const preClient = new PreClient();

/* eslint-disable jest/expect-expect */
describe('PreClient success', () => {
  test('get recording', async () => {
    mock();
    const recording = await preClient.getRecording('something');
    expect(recording).toBeTruthy();
  });
  test('get recordings', async () => {
    mock();
    const request = {} as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(request);
    expect(recordings).toBeTruthy();
  });
});

/* eslint-disable jest/expect-expect */
describe('PreClient failure', () => {
  test('get recording', async () => {
    const recording = await preClient.getRecording('something');
    expect(recording).toBeFalsy();
  });
  // test('get recordings', async () => {
  //   const request = {} as SearchRecordingsRequest;
  //   const recordings = await preClient.getRecordings(request);
  //   expect(recordings).toBeFalsy();
  // });
});

beforeEach(() => {
  reset();
});

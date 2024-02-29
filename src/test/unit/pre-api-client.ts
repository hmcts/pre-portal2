import { mockRecordings } from '../mock-api';
import { PreClient } from '../../main/services/pre-api/pre-client';
import { SearchRecordingsRequest } from '../../main/services/pre-api/types';
import { describe } from '@jest/globals';
import axios from 'axios';

const preClient = new PreClient();

/* eslint-disable jest/expect-expect */
describe('PreClient success', () => {
  test('get recording', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockRecordings[0] } as any);
    const recording = await preClient.getRecording('something');
    expect(recording).toBeTruthy();
  });
  test('get recordings', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { _embedded: { recordingDTOList: mockRecordings } } } as any);
    const request = {} as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(request);
    expect(recordings).toBeTruthy();
  });
  test('get recordings when none are found', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue(null as any);
    const request = {} as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(request);
    expect(recordings).toEqual([]);
  });
  test('get recording playback data', async () => {
    jest.spyOn(axios, 'create').mockReturnValue(axios);
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        manifestpath: 'manifestpath',
        aestoken: 'aestoken',
      },
    } as any);
    const recordingPlaybackData = await preClient.getRecordingPlaybackData('something');
    expect(recordingPlaybackData).toBeTruthy();
  });
});

/* eslint-disable jest/expect-expect */
describe('PreClient failure', () => {
  test('get recording', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: null } as any);
    const recording = await preClient.getRecording('something');
    expect(recording).toBeFalsy();
  });
  test('get recordings', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error('error');
    });
    const request = {} as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(request);
    expect(recordings).toBeFalsy();
  });
  test('get recording playback data', async () => {
    jest.spyOn(axios, 'create').mockReturnValue(axios);
    jest.spyOn(axios, 'post').mockImplementation(() => {
      throw new Error('error');
    });
    const recordingPlaybackData = await preClient.getRecordingPlaybackData('something');
    expect(recordingPlaybackData).toBeFalsy();
  });
});

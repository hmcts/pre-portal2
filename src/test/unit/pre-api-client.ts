import { mockedPaginatedRecordings, mockRecordings } from '../mock-api';
import { PreClient } from '../../main/services/pre-api/pre-client';
import { SearchRecordingsRequest } from '../../main/services/pre-api/types';
import { describe } from '@jest/globals';
import axios from 'axios';

const preClient = new PreClient();
jest.mock('axios');

/* eslint-disable jest/expect-expect */
describe('PreClient', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  // @ts-ignore
  mockedAxios.get.mockImplementation((url, config) => {
    if (url === '/recordings/something') {
      return Promise.resolve({
        status: 200,
        data: mockRecordings.find(r => r.id === 'something'),
      });
    }
    if (url === '/recordings') {
      // @ts-ignore
      if (config['params']['caseReference'] == 'uhoh') {
        return Promise.reject('Network Error');
      }

      // @ts-ignore
      if (config['params']['caseReference'] == 'noresults') {
        return Promise.resolve({
          status: 200,
          data: {
            page: {
              size: 20,
              totalElements: 0,
              totalPages: 1,
              number: 0,
            },
          },
        });
      }

      return Promise.resolve({
        status: 200,
        data: mockedPaginatedRecordings,
      });
    }
    throw new Error('Invalid URL: ' + url);
  });

  test('get recording', async () => {
    const recording = await preClient.getRecording('something');
    expect(recording).toBeTruthy();
    expect(recording?.id).toBe('something');
  });
  test('get recordings', async () => {
    const request = {} as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(request);
    expect(recordings).toBeTruthy();
    expect(recordings.length).toBe(2);
  });
  test('get recordings no results', async () => {
    const request = {
      caseReference: 'noresults',
    } as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(request);
    expect(recordings).toBeTruthy();
    expect(recordings.length).toBe(0);
  });
  test('network error', async () => {
    try {
      await preClient.getRecordings({ caseReference: 'uhoh' } as SearchRecordingsRequest);
    } catch (e) {
      expect(e).toBe('Network Error');
    }
  });
});

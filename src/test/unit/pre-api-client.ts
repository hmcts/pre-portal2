import { mockedPaginatedRecordings, mockRecordings, mockXUserId } from '../mock-api';
import { PreClient } from '../../main/services/pre-api/pre-client';
import { SearchRecordingsRequest } from '../../main/services/pre-api/types';
import { describe } from '@jest/globals';
import axios from 'axios';
import { UserProfile } from '../../main/types/user-profile';
import config from 'config';
import { mockeduser } from './test-helper';
import { AccessStatus } from '../../main/types/access-status';

const preClient = new PreClient();
const mockRecordingId = '12345678-1234-1234-1234-1234567890ab';
jest.mock('axios');

/* eslint-disable jest/expect-expect */
describe('PreClient', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  // @ts-ignore
  mockedAxios.get.mockImplementation((url: string, config: object) => {
    // @ts-ignore
    if (url === '/users/by-email/test@testy.com') {
      return Promise.resolve({
        status: 200,
        data: mockeduser,
      });
    }
    if (url === '/users/by-email/mctest@testy.com') {
      return Promise.reject('404');
    }
    if (url === '/users/by-email/inactive@testy.com') {
      const inactiveUser = { ...mockeduser } as UserProfile;
      inactiveUser.portal_access[0].status = AccessStatus.INACTIVE;
      return Promise.resolve({
        status: 200,
        data: inactiveUser,
      });
    }
    if (url === '/users/by-email/noportal_access@testy.com') {
      const noPortalUser = { ...mockeduser };
      // @ts-ignore
      delete noPortalUser.portal_access;
      return Promise.resolve({
        status: 200,
        data: noPortalUser,
      });
    }
    if (url === `/recordings/${mockRecordingId}`) {
      return Promise.resolve({
        status: 200,
        data: mockRecordings.find(r => r.id === mockRecordingId),
      });
    }
    if (url === '/recordings') {
      if (config['headers']['X-User-Id'] === mockXUserId) {
        return Promise.resolve({
          status: 200,
          data: mockedPaginatedRecordings,
        });
      } else if (config['params']['caseReference'] == 'uhoh') {
        return Promise.reject('Network Error');
      }
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
  });
  mockedAxios.post.mockImplementation((url, data, _config) => {
    if (url === (config.get('ams.flowUrl') as string)) {
      return Promise.resolve({
        status: 200,
        data: {
          manifestpath: 'something',
          aestoken: 'something',
        },
      });
    }
    throw new Error('Invalid URL: ' + url);
  });
  mockedAxios.create.mockImplementation(() => mockedAxios);

  const otherXUserId = 'a114f40e-bdba-432d-b53f-37169ee5bf90';

  test('get recording', async () => {
    const recording = await preClient.getRecording(mockXUserId, mockRecordingId);
    expect(recording).toBeTruthy();
    expect(recording?.id).toBe(mockRecordingId);
  });
  test('get recordings', async () => {
    const request = {} as SearchRecordingsRequest;
    const { recordings, pagination } = await preClient.getRecordings(mockXUserId, request);
    expect(recordings).toBeTruthy();
    expect(recordings.length).toBe(2);
    expect(pagination).toBeTruthy();
  });
  test('get recordings no results', async () => {
    const request = {} as SearchRecordingsRequest;
    const { recordings, pagination } = await preClient.getRecordings(otherXUserId, request);
    expect(recordings).toBeTruthy();
    expect(recordings.length).toBe(0);
    expect(pagination).toBeTruthy();
  });
  test('network error', async () => {
    try {
      await preClient.getRecordings(otherXUserId, { caseReference: 'uhoh' } as SearchRecordingsRequest);
      expect(true).toBe(false); // shouldn't get here...
    } catch (e) {
      expect(e).toBe('Network Error');
    }
  });
  test('get user by email ok', async () => {
    const user = await preClient.getUserByEmail('test@testy.com');
    expect(user).toBeTruthy();
    expect(user.user.email).toBe('test@testy.com');
  });
  test('get user by email 404', async () => {
    try {
      await preClient.getUserByEmail('mctest@testy.com');
      expect(true).toBe(false); // shouldn't get here...
    } catch (e) {
      expect(e).toEqual('404');
    }
  });
  test('get user by email inactive', async () => {
    try {
      await preClient.getUserByEmail('inactive@testy.com');
      expect(true).toBe(false); // shouldn't get here...
    } catch (e) {
      expect(e.message).toEqual('User is not active: inactive@testy.com');
    }
  });
  test('get recording playback data', async () => {
    const recording = await preClient.getRecordingPlaybackData(otherXUserId, mockRecordingId);
    expect(recording).toBeTruthy();
    expect(recording?.src).toBe('something');
  });
  test("user doesn't have a portal_access object in their profile", async () => {
    try {
      await preClient.getUserByEmail('noportal_access@testy.com');
    } catch (e) {
      expect(e.message).toEqual('User has not been invited to the portal: noportal_access@testy.com');
    }
  });
});

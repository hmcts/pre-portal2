import { mockedPaginatedRecordings, mockRecordings, mockXUserId } from '../mock-api';
import { PreClient } from '../../main/services/pre-api/pre-client';
import { SearchRecordingsRequest } from '../../main/services/pre-api/types';
import { describe } from '@jest/globals';
import axios from 'axios';
import { UserProfile } from '../../main/types/user-profile';

const preClient = new PreClient();
jest.mock('axios');

/* eslint-disable jest/expect-expect */
describe('PreClient', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedUser = {
    id: '123',
    court: {
      id: '123',
      name: 'Test',
      court_type: 'Test',
      location_code: 'Test',
      regions: [
        {
          name: 'Test',
        },
      ],
      rooms: [],
    },
    role: {
      id: 'Test',
      name: 'Test',
      description: 'Test',
      permissions: [],
    },
    last_access: null,
    active: true,
    user: {
      id: 'Test',
      first_name: 'Test',
      last_name: 'Test',
      email: 'test@testy.com',
      phone_number: null,
      organisation: null,
    },
  };
  // @ts-ignore
  mockedAxios.get.mockImplementation((url: string, config: object) => {
    // @ts-ignore
    if (url === '/users/by-email/test@testy.com') {
      console.log('here');
      return Promise.resolve({
        status: 200,
        data: [mockedUser],
      });
    }
    if (url === '/users/by-email/mctest@testy.com') {
      return Promise.resolve({
        status: 200,
        data: [],
      });
    }
    if (url === '/users/by-email/inactive@testy.com') {
      const inactiveUser = { ...mockedUser };
      inactiveUser.active = false;
      return Promise.resolve({
        status: 200,
        data: [inactiveUser],
      });
    }
    if (url === '/recordings/something') {
      return Promise.resolve({
        status: 200,
        data: mockRecordings.find(r => r.id === 'something'),
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

  const otherXUserId = 'a114f40e-bdba-432d-b53f-37169ee5bf90';

  test('get recording', async () => {
    const recording = await preClient.getRecording(mockXUserId, 'something');
    expect(recording).toBeTruthy();
    expect(recording?.id).toBe('something');
  });
  test('get recordings', async () => {
    const request = {} as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(mockXUserId, request);
    expect(recordings).toBeTruthy();
    expect(recordings.length).toBe(2);
  });
  test('get recordings no results', async () => {
    const request = {} as SearchRecordingsRequest;
    const recordings = await preClient.getRecordings(otherXUserId, request);
    expect(recordings).toBeTruthy();
    expect(recordings.length).toBe(0);
  });
  test('network error', async () => {
    try {
      await preClient.getRecordings(otherXUserId, { caseReference: 'uhoh' } as SearchRecordingsRequest);
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
    const user = await preClient.getUserByEmail('mctest@testy.com');
    expect(user).toEqual({} as UserProfile);
  });
  test('get user by email inactive', async () => {
    const user = await preClient.getUserByEmail('inactive@testy.com');
    expect(user).toEqual({} as UserProfile);
  });
});

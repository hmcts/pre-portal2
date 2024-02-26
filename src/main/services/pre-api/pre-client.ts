import { UserProfile } from '../../types/user-profile';

import { Recording, RecordingPlaybackData, SearchRecordingsRequest } from './types';

import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';

export class PreClient {
  logger = Logger.getLogger('pre-client');

  public async getUserByEmail(email: string): Promise<UserProfile> {
    const response = await axios.get('/users/by-email/' + email);
    if (response.data.length !== 1) {
      this.logger.error('No user found for email: ' + email);
      return {} as UserProfile;
    }
    const user = response.data[0] as UserProfile;
    if (!user.active) {
      this.logger.error('User is not active: ' + email);
      return {} as UserProfile;
    }
    return user;
  }

  public async getRecordings(xUserId: string, request: SearchRecordingsRequest): Promise<Recording[]> {
    this.logger.debug('Getting recordings with request: ' + JSON.stringify(request));

    try {
      const response = await axios.get('/recordings', {
        headers: {
          'X-User-Id': xUserId,
        },
        params: request,
      });

      if (response.data['page']['totalElements'] === 0) {
        return [];
      }
      return response.data['_embedded']['recordingDTOList'] as Recording[];
    } catch (e) {
      // log the error
      this.logger.info('path', e.response?.request.path);
      this.logger.info('res headers', e.response?.headers);
      this.logger.info('data', e.response?.data);
      // rethrow the error for the UI
      throw e;
    }
  }

  public async getRecording(xUserId: string, id: string): Promise<Recording | null> {
    try {
      const response = await axios.get(`/recordings/${id}`, {
        headers: {
          'X-User-Id': xUserId,
        },
      });

      return response.data as Recording;
    } catch (e) {
      if (e.response?.status === 404) {
        return null;
      }

      this.logger.error(e);
      throw e;
    }
  }

  public async getRecordingPlaybackData(id: string): Promise<RecordingPlaybackData | null> {
    const url = config.get('ams.flowUrl') as string;
    const key = config.get('ams.flowKey') as string;
    const axiosClient = axios.create(); // TODO: move AMS playback logic to API and use instead of flow above

    try {
      const response = await axiosClient.post(
        url,
        {
          RecordingId: id,
          AccountID: 'e1b7674b-b94d-4e07-9957-48345845885a', // TODO: get authenticated user id. Remove when AMS playback logic is moved to API
        },
        {
          headers: {
            'X-Flow-Key': key,
          },
        }
      );

      return {
        src: response.data['manifestpath'],
        type: 'application/vnd.ms-sstr+xml',
        protectionInfo: [
          {
            type: 'AES',
            authenticationToken: `Bearer ${response.data['aestoken']}`,
          },
        ],
      } as RecordingPlaybackData;
    } catch (e) {
      if (e.response?.status === 404) {
        return null;
      }

      this.logger.error(e);
      throw e;
    }
  }
}

import { AccessStatus } from '../../types/access-status';
import { UserProfile } from '../../types/user-profile';

import { Pagination, Recording, RecordingPlaybackData, SearchRecordingsRequest } from './types';

import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';

export class PreClient {
  logger = Logger.getLogger('pre-client');

  public async isInvitedUser(email: string): Promise<boolean> {
    const response = await axios.get('/invites', {
      params: {
        email,
      },
    });
    return response.data.page.totalElements > 0;
  }

  public async redeemInvitedUser(email: string): Promise<void> {
    await axios.post('/invites/redeem?email=' + email);
  }

  public async getUserByEmail(email: string): Promise<UserProfile> {
    const response = await axios.get('/users/by-email/' + email);
    const user = response.data as UserProfile;
    if (user.portal_access[0].status === AccessStatus.INACTIVE) {
      throw new Error('User is not active: ' + email);
    }
    return user;
  }

  public async getRecordings(
    xUserId: string,
    request: SearchRecordingsRequest
  ): Promise<{ recordings: Recording[]; pagination: Pagination }> {
    this.logger.debug('Getting recordings with request: ' + JSON.stringify(request));

    try {
      const response = await axios.get('/recordings', {
        headers: {
          'X-User-Id': xUserId,
        },
        params: request,
      });

      const pagination = {
        currentPage: response.data['page']['number'],
        totalPages: response.data['page']['totalPages'],
        totalElements: response.data['page']['totalElements'],
        size: response.data['page']['size'],
      } as Pagination;
      const recordings =
        response.data['page']['totalElements'] === 0
          ? []
          : (response.data['_embedded']['recordingDTOList'] as Recording[]);

      return { recordings, pagination };
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

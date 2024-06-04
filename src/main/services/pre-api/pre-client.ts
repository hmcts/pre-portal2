import { AccessStatus } from '../../types/access-status';
import { User } from '../../types/user';
import { UserProfile } from '../../types/user-profile';

import { Pagination, PutAuditRequest, Recording, RecordingPlaybackData, SearchRecordingsRequest } from './types';

import { Logger } from '@hmcts/nodejs-logging';
import axios, { AxiosResponse } from 'axios';
import config from 'config';

export class PreClient {
  logger = Logger.getLogger('pre-client');

  public async healthCheck(): Promise<void> {
    await axios.get('/health');
  }

  public async putAudit(xUserId: string, request: PutAuditRequest): Promise<AxiosResponse> {
    try {
      return await axios.put('/audit/' + request.id, request, {
        headers: {
          'X-User-Id': xUserId,
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  public async getUserByClaimEmail(email: string): Promise<UserProfile> {
    let userProfile: UserProfile;
    try {
      userProfile = await this.getUserByEmail(email);
    } catch (e) {
      this.logger.error(e.message);
      throw new Error('User has not been invited to the portal');
    }

    if (!userProfile.portal_access || userProfile.portal_access.length === 0) {
      const invitedUser = await this.isInvitedUser(email);
      if (!invitedUser) {
        throw new Error(
          'User access is not available at this time. Please confirm with support if access is expected.'
        );
      }
      try {
        await this.redeemInvitedUser(email);
        userProfile = await this.getUserByEmail(email);
      } catch (e) {
        throw new Error('Error redeeming user invitation: ' + email);
      }
    } else if (userProfile.portal_access[0].status === AccessStatus.INACTIVE) {
      throw new Error('User is not active: ' + email);
    }

    return userProfile;
  }

  public async isInvitedUser(email: string): Promise<boolean> {
    try {
      const response = await axios.get('/invites', {
        params: {
          email,
          status: AccessStatus.INVITATION_SENT,
        },
      });
      return response.data.page.totalElements > 0;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }

  public async redeemInvitedUser(email: string): Promise<void> {
    await axios.post(
      '/invites/redeem',
      {},
      {
        params: {
          email,
        },
      }
    );
  }

  public async getUserByEmail(email: string): Promise<UserProfile> {
    const response = await axios.get('/users/by-email/' + encodeURIComponent(email));
    return response.data as UserProfile;
  }

  public async getUserById(id: string, xUserId: string): Promise<User> {
    const response = await axios.get('/users/' + id, {
      headers: {
        'X-User-Id': xUserId,
      },
    });
    return response.data as User;
  }

  public async updateUser(user: User, xUserId: string): Promise<boolean> {
    const updateUser = this.createUpdateUserFromUser(user);
    this.logger.info('Updating user: ' + JSON.stringify(updateUser));
    await axios.put('/users/' + user.id, updateUser, {
      headers: {
        'X-User-Id': xUserId,
      },
    });
    return true;
  }

  private createUpdateUserFromUser(profile: User): User {
    return {
      app_access: profile.app_access.map(access => ({
        active: access.active,
        court_id: access.court.id,
        id: access.id,
        last_active: access.last_access,
        role_id: access.role.id,
        user_id: profile.id,
      })),
      email: profile.email,
      first_name: profile.first_name,
      id: profile.id,
      last_name: profile.last_name,
      organisation: profile.organisation,
      phone_number: profile.phone_number,
      portal_access: profile.portal_access.map(access => ({
        id: access.id,
        invited_at: access.invited_at,
        last_access: access.last_access,
        registered_at: access.registered_at,
        status: access.status,
      })),
    } as User;
  }

  public async sendInvite(userProfile: UserProfile, xUserId: string): Promise<boolean> {
    await axios.put(
      '/invites/' + userProfile.user.id,
      {
        email: userProfile.user.email,
        first_name: userProfile.user.first_name,
        last_name: userProfile.user.last_name,
        organisation: userProfile.user.organisation,
        phone: userProfile.user.phone_number,
        user_id: userProfile.user.id,
      },
      {
        headers: {
          'X-User-Id': xUserId,
        },
      }
    );

    return true;
  }

  public async getActiveUserByEmail(email: string): Promise<UserProfile> {
    const userProfile = await this.getUserByEmail(email);
    if (!userProfile.portal_access || userProfile.portal_access.length === 0) {
      throw new Error('User does not have access to the portal: ' + email);
    } else if (userProfile.portal_access[0].status === AccessStatus.INACTIVE) {
      throw new Error('User is not active: ' + email);
    }
    return userProfile;
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

  public async getRecordingPlaybackData(xUserId: string, id: string): Promise<RecordingPlaybackData | null> {
    const url = config.get('ams.flowUrl') as string;
    const key = config.get('ams.flowKey') as string;
    const axiosClient = axios.create(); // TODO: move AMS playback logic to API and use instead of flow above

    try {
      const response = await axiosClient.post(
        url,
        {
          RecordingId: id,
          AccountID: xUserId,
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

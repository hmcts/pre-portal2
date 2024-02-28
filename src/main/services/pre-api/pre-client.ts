import { Recording, RecordingPlaybackData, SearchRecordingsRequest } from './types';

import axios from 'axios';
import config = require('config');

export class PreClient {
  // TODO: get only recordings shared with the authenticated user
  public async getRecordings(request: SearchRecordingsRequest): Promise<Recording[] | null> {
    try {
      const response = await axios.get('/recordings', {
        params: request,
      });

      return response.data['_embedded']['recordingDTOList'] as Recording[];
    } catch (e) {
      if (e instanceof TypeError) {
        return [];
      } else {
        return null;
      }
    }
  }

  public async getRecording(id: string): Promise<Recording | null> {
    try {
      const response = await axios.get(`/recordings/${id}`);

      return response.data as Recording;
    } catch (e) {
      return null;
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
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
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
      return null;
    }
  }
}

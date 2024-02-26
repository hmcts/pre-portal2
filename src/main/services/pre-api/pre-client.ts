import { Recording, SearchRecordingsRequest } from './types';

import axios from 'axios';

export class PreClient {
  public async getRecordings(request: SearchRecordingsRequest): Promise<Recording[] | null> {
    try {
      const response = await axios.get('/recordings', {
        params: request,
      });

      return response.data['_embedded']['recordingDTOList'] as Recording[];
    } catch (e) {
      return null;
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
}

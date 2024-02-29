import { Recording, SearchRecordingsRequest } from './types';

import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';

export class PreClient {
  logger = Logger.getLogger('pre-client');

  public async getRecordings(request: SearchRecordingsRequest): Promise<Recording[]> {
    this.logger.debug('Getting recordings with request: ' + JSON.stringify(request));
    try {
      const response = await axios.get('/recordings', {
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

  public async getRecording(id: string): Promise<Recording | null> {
    try {
      const response = await axios.get(`/pre-api/recordings/${id}`);

      return response.data as Recording;
    } catch (e) {
      return null;
    }
  }
}

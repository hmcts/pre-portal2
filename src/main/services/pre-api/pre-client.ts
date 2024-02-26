import { CaptureSession, Recording, SearchCaptureSessionsRequest } from './types';

import axios from 'axios';

export class PreClient {
  public async getCaptureSessions(request: SearchCaptureSessionsRequest): Promise<CaptureSession[] | null> {
    const captureSessions: CaptureSession[] = [];

    try {
      const response = await axios.get('/capture-sessions', request);
      const dtoList = response.data['_embedded']['captureSessionDTOList'];

      dtoList.forEach((captureSession: CaptureSession) => {
        return captureSessions.push(captureSession);
      });
    } catch (e) {
      return null;
    }

    return captureSessions;
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

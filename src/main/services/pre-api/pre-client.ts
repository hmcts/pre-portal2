import { CaptureSession, Recording, SearchCaptureSessionsRequest } from './types';

import axios, { AxiosInstance } from 'axios';



export class PreClient {
  public async getCaptureSessions(request: SearchCaptureSessionsRequest): Promise<CaptureSession[]> {
    let captureSessions = [];

    try {
      const response = await axios.get('/capture-sessions', request);

      // TODO: Map response to Capture Session list
    } catch (e) {

    }

    return captureSessions
  }

  public async getRecording(id: string): Promise<Recording> {
    let recording = {} as Recording;

    try {
      const response = await axios.get(`/recordings/${id}`);
    } catch (e) {

    }

    return recording;
  }
}

import { CaptureSession, Recording, SearchCaptureSessionsRequest } from './types';

import axios from 'axios';



export class PreClient {
  public async getCaptureSessions(request: SearchCaptureSessionsRequest): Promise<CaptureSession[] | null> {
    let captureSessions = [];

    try {
      const response = await axios.get('/capture-sessions', request);

      // TODO: Map response to Capture Session list
    } catch (e) {
      return null;
    }

    return captureSessions;
  }

  public async getRecording(id: string): Promise<Recording | null> {
    let recording = {} as Recording;

    try {
      const response = await axios.get(`/recordings/${id}`);

      // TODO: Map response to Recording
    } catch (e) {
      return null;
    }

    return recording;
  }
}

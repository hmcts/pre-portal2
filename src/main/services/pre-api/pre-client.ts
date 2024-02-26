import { CaptureSession, Recording, SearchCaptureSessionsRequest } from './types';

import { AxiosInstance } from 'axios';



export class PreClient {
  constructor(
    private readonly httpClient: AxiosInstance,
  ) { }

  public async getCaptureSessions(request: SearchCaptureSessionsRequest): Promise<CaptureSession[]> {
    let captureSessions = [];

    try {
      const response = await this.httpClient.get('/capture-sessions', request);

      // TODO: Map response to Capture Session list
    } catch (e) {

    }

    return captureSessions
  }

  public async getRecording(id: string): Promise<Recording> {
    let recording = {} as Recording;

    try {
      const response = await this.httpClient.get(`/recordings/${id}`);
    } catch (e) {

    }

    return recording;
  }
}

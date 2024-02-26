import { AxiosRequestConfig } from 'axios';

export interface SearchCaptureSessionsRequest extends AxiosRequestConfig {
  caseReference?: string;
  bookingId?: string;
  origin?: string;
  recordingStatus?: string;
  scheduledFor?: string;
  page?: number;
  size?: number;
}

export interface CaptureSession {
  id: string;
  bookingId: string;
  origin: string;
  ingestAddress: string;
  liveOutputUrl: string;
  startedAt: string;
  startedByUserId: string;
  finishedAt: string;
  finishedByUserId: string;
  status: string;
  deletedAt: string;
  courtName: string;
}

export interface Recording {
  id: string;
  parentRecordingId: string;
  version: number;
  filename: string;
  duration: string;
  editInstructions: string;
  captureSession: CaptureSession;
  deletedAt: string;
  createdAt: string;
  caseReference: string;
  isTestCase: boolean;
  participants: Participant[];
}

export interface Participant {
  id: string;
  participantType: string;
  firstName: string;
  lastName: string;
  deletedAt: string;
  createdAt: string;
  modifiedAt: string;
}

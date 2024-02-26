import { Recording } from '../main/services/pre-api/types';
import { PreClient } from '../main/services/pre-api/pre-client';

export const mockRecordings: Recording[] = [
  {
    id: 'something',
    parentRecordingId: 'parentId',
    version: 1,
    filename: 'filename',
    duration: 'duration',
    editInstructions: 'editInstructions',
    captureSession: {
      id: '',
      bookingId: '',
      origin: '',
      ingestAddress: '',
      liveOutputUrl: '',
      startedAt: '',
      startedByUserId: '',
      finishedAt: '',
      finishedByUserId: '',
      status: '',
      deletedAt: '',
      courtName: '',
    },
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    caseReference: 'caseReference',
    isTestCase: false,
    participants: [],
  } as Recording,
  {
    id: 'somethingElse',
    parentRecordingId: 'parentId',
    version: 1,
    filename: 'filename',
    duration: 'duration',
    editInstructions: 'editInstructions',
    captureSession: {
      id: '',
      bookingId: '',
      origin: '',
      ingestAddress: '',
      liveOutputUrl: '',
      startedAt: '',
      startedByUserId: '',
      finishedAt: '',
      finishedByUserId: '',
      status: '',
      deletedAt: '',
      courtName: '',
    },
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    caseReference: 'caseReference',
    isTestCase: false,
    participants: [],
  } as Recording,
];

export function mock() {
  jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (id: string) => {
    return Promise.resolve(mockRecordings.find(r => r.id === id) || null);
  });

  jest.spyOn(PreClient.prototype, 'getRecordings').mockImplementation(async () => {
    return Promise.resolve(mockRecordings);
  });
}

export function reset() {
  jest.spyOn(PreClient.prototype, 'getRecording').mockRestore();
}

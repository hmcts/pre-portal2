import { Recording, SearchRecordingsRequest } from '../main/services/pre-api/types';
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

export const mockXUserId = 'a114f40e-bdba-432d-b53f-37169ee5bf99';

export function mock() {
  jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (xUserId: string, id: string) => {
    return Promise.resolve(mockRecordings.find(r => r.id === id) || null);
  });

  jest
    .spyOn(PreClient.prototype, 'getRecordings')
    .mockImplementation(async (xUserId: string, req: SearchRecordingsRequest) => {
      return Promise.resolve(mockRecordings);
    });
}

export function reset() {
  jest.spyOn(PreClient.prototype, 'getRecording').mockRestore();
  jest.spyOn(PreClient.prototype, 'getRecordings').mockRestore();
}

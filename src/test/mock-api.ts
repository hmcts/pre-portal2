import { Recording, RecordingPlaybackData } from '../main/services/pre-api/types';
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

// needs to return the paginated list
export const mockedPaginatedRecordings = {
  _embedded: {
    recordingDTOList: mockRecordings,
  },
  page: {
    size: 20,
    totalElements: 2,
    totalPages: 1,
    number: 0,
  },
};

export function mock() {
  mockGetRecording();
  mockGetRecordings();
  mockGetRecordingPlaybackData();
}

export function mockGetRecording(recording?: Recording | null) {
  if (recording !== undefined) {
    jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (id: string) => {
      return Promise.resolve(recording);
    });
    return;
  }

  jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (id: string) => {
    return Promise.resolve(mockRecordings.find(r => r.id === id) || null);
  });
}

export function mockGetRecordings(recordings?: Recording[]) {
  if (recordings !== undefined) {
    jest.spyOn(PreClient.prototype, 'getRecordings').mockImplementation(async () => {
      return Promise.resolve(recordings);
    });
    return;
  }

  jest.spyOn(PreClient.prototype, 'getRecordings').mockImplementation(async () => {
    return Promise.resolve(mockRecordings);
  });
}

export function mockGetRecordingPlaybackData(data?: RecordingPlaybackData | null) {
  if (data !== undefined) {
    jest.spyOn(PreClient.prototype, 'getRecordingPlaybackData').mockImplementation(async (id: string) => {
      return Promise.resolve(data);
    });
    return;
  }

  jest.spyOn(PreClient.prototype, 'getRecordingPlaybackData').mockImplementation(async (id: string) => {
    return Promise.resolve({
      src: 'src',
      type: 'type',
      protectionInfo: [],
    } as RecordingPlaybackData);
  });
}

export function reset() {
  jest.spyOn(PreClient.prototype, 'getRecording').mockRestore();
  jest.spyOn(PreClient.prototype, 'getRecordings').mockRestore();
  jest.spyOn(PreClient.prototype, 'getRecordingPlaybackData').mockRestore();
}

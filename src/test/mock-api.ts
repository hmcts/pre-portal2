import { Pagination, Recording, RecordingPlaybackData, SearchRecordingsRequest } from '../main/services/pre-api/types';
import { PreClient } from '../main/services/pre-api/pre-client';

export const mockRecordings: Recording[] = [
  {
    id: '12345678-1234-1234-1234-1234567890ab',
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
    id: '12345678-1234-1234-1234-1234567890ac',
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

export const mockPagination = {
  currentPage: 0,
  totalPages: 1,
  totalElements: 2,
  size: 10,
} as Pagination;

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

export const mockXUserId = 'a114f40e-bdba-432d-b53f-37169ee5bf99';

export function mock() {
  mockGetRecording();
  mockGetRecordings();
  mockGetRecordingPlaybackData();
}

export function mockGetRecording(recording?: Recording | null) {
  if (recording !== undefined) {
    jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (xUserId: string, id: string) => {
      return Promise.resolve(recording);
    });
    return;
  }

  jest.spyOn(PreClient.prototype, 'getRecording').mockImplementation(async (xUserId: string, id: string) => {
    return Promise.resolve(mockRecordings.find(r => r.id === id) || null);
  });
}

export function mockGetRecordings(recordings?: Recording[], page: number = 0) {
  if (recordings !== undefined) {
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(recordings.length / 10),
      totalElements: recordings.length,
      size: 10,
    } as Pagination;
    const recordingSubset = recordings.slice(page * 10, (page + 1) * 10);

    jest
      .spyOn(PreClient.prototype, 'getRecordings')
      .mockImplementation(async (xUserId: string, request: SearchRecordingsRequest) => {
        return Promise.resolve({ recordings: recordingSubset, pagination });
      });
    return;
  }

  jest
    .spyOn(PreClient.prototype, 'getRecordings')
    .mockImplementation(async (xUserId: string, req: SearchRecordingsRequest) => {
      return Promise.resolve({ recordings: mockRecordings, pagination: mockPagination });
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

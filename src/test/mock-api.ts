import {
  Audit,
  Pagination,
  PutAuditRequest,
  Recording,
  RecordingPlaybackData,
  SearchAuditLogsRequest,
  SearchRecordingsRequest,
} from '../main/services/pre-api/types';
import { PreClient } from '../main/services/pre-api/pre-client';
import { AxiosResponse } from 'axios';
import { Terms } from '../main/types/terms';

export const mockAuditLogs: Audit[] = [
  {
    id: '12345678-1234-1234-1234-1234567890ab',
    functional_area: 'Video Player',
    category: 'Recording',
    activity: 'Play',
    source: 'PORTAL',
    audit_details: {
      recordingId: '12345678-1234-1234-1234-1234567890ab',
    },
    created_by: '12345678-1234-1234-1234-1234567890ab',
    created_at: '2021-09-01T12:00:00Z',
  } as Audit,
  {
    id: '12345678-1234-1234-1234-1234567890ac',
    functional_area: 'Video Player',
    category: 'Recording',
    activity: 'Play',
    source: 'PORTAL',
    audit_details: {
      recordingId: '12345678-1234-1234-1234-1234567890ac',
    },
    created_by: '12345678-1234-1234-1234-1234567890ab',
    created_at: '2021-09-01T12:00:00Z',
  } as Audit,
];

export const mockRecordings: Recording[] = [
  {
    id: '12345678-1234-1234-1234-1234567890ab',
    parent_recording_id: 'parentId',
    version: 1,
    filename: 'filename',
    duration: 'duration',
    edit_instructions: 'editInstructions',
    case_id: '12345678-1234-1234-1234-1234567890ab',
    capture_session: {
      id: '',
      booking_id: '',
      origin: '',
      ingest_address: '',
      live_output_url: '',
      started_at: '',
      started_by_user_id: '',
      finished_at: '',
      finished_by_user_id: '',
      status: '',
      deleted_at: '',
      court_name: '',
      case_state: 'PENDING_CLOSURE',
    },
    deleted_at: 'deletedAt',
    created_at: 'createdAt',
    case_reference: 'caseReference',
    is_test_case: false,
    participants: [],
  } as Recording,
  {
    id: '12345678-1234-1234-1234-1234567890ac',
    parent_recording_id: 'parentId',
    version: 1,
    filename: 'filename',
    duration: 'duration',
    edit_instructions: 'editInstructions',
    case_id: '12345678-1234-1234-1234-1234567890ac',
    capture_session: {
      id: '',
      booking_id: '',
      origin: '',
      ingest_address: '',
      live_output_url: '',
      started_at: '',
      started_by_user_id: '',
      finished_at: '',
      finished_by_user_id: '',
      status: '',
      deleted_at: '',
      court_name: '',
      case_state: 'OPEN',
    },
    deleted_at: 'deletedAt',
    created_at: 'createdAt',
    case_reference: 'caseReference',
    is_test_case: false,
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

export const mockedPaginatedAuditLogs = {
  _embedded: {
    auditDTOList: mockAuditLogs,
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

export function mockGetAuditLogs(auditLogs?: Audit[], page: number = 0) {
  if (auditLogs !== undefined) {
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(auditLogs.length / 10),
      totalElements: auditLogs.length,
      size: 10,
    } as Pagination;
    const auditLogsSubset = auditLogs.slice(page * 10, (page + 1) * 10);

    jest
      .spyOn(PreClient.prototype, 'getAuditLogs')
      .mockImplementation(async (xUserId: string, request: SearchAuditLogsRequest) => {
        return Promise.resolve({ auditLogs: auditLogsSubset, pagination });
      });
    return;
  }

  jest
    .spyOn(PreClient.prototype, 'getAuditLogs')
    .mockImplementation(async (xUserId: string, req: SearchRecordingsRequest) => {
      return Promise.resolve({ auditLogs: mockRecordings, pagination: mockPagination });
    });
}

export const mockPutAudit = () => {
  jest.spyOn(PreClient.prototype, 'putAudit').mockImplementation(async (xUserId: string, request: PutAuditRequest) => {
    return Promise.resolve({
      status: 201,
      statusText: 'CREATED',
    } as AxiosResponse);
  });
};

export function mockGetLatestTermsAndConditions(data?: Terms | null) {
  if (data !== undefined) {
    jest
      .spyOn(PreClient.prototype, 'getLatestTermsAndConditions')
      .mockImplementation(async (xUserId: string, id: string) => {
        return Promise.resolve(data);
      });
  }
}

export function mockAcceptTermsAndConditions() {
  jest
    .spyOn(PreClient.prototype, 'acceptTermsAndConditions')
    .mockImplementation(async (xUserId: string, termsId: string) => {
      return Promise.resolve();
    });
}

export function mockGetRecordingPlaybackData(data?: RecordingPlaybackData | null) {
  if (data !== undefined) {
    jest
      .spyOn(PreClient.prototype, 'getRecordingPlaybackDataMk')
      .mockImplementation(async (xUserId: string, id: string) => {
        return Promise.resolve(data);
      });
    return;
  }

  jest
    .spyOn(PreClient.prototype, 'getRecordingPlaybackDataMk')
    .mockImplementation(async (xUserId: string, id: string) => {
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
  jest.spyOn(PreClient.prototype, 'getRecordingPlaybackDataMk').mockRestore();
}

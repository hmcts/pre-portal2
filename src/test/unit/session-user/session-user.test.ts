/* eslint-disable jest/expect-expect */
import { SessionUser } from '../../../main/services/session-user/session-user';
import { createRequest } from 'node-mocks-http';
import { UserProfile } from '../../../main/types/user-profile';
import { mockeduser } from '../test-helper';

jest.mock('../../../main/services/pre-api/pre-client', () => ({
  PreClient: jest.fn().mockImplementation(() => ({
    constructor: () => {},
    getUserByEmail: jest.fn().mockImplementation((s: string) => {
      return Promise.resolve(mockeduser as UserProfile);
    }),
  })),
}));
describe('Session Users', () => {
  test('getLoggedInUser no session', async () => {
    const t = async () => {
      await SessionUser.getLoggedInUserPortalId({} as Express.Request);
    };
    await expect(t).rejects.toThrow('No session found');
  });

  test('getLoggedInUser no userProfile', async () => {
    const req = createRequest();
    req['__session'] = {};
    const t = async () => {
      await SessionUser.getLoggedInUserPortalId(req);
    };
    await expect(t).rejects.toThrow('No userProfile found in session');
  });

  test('getLoggedInUserPortalId no user id', async () => {
    const req = createRequest();
    req['__session'] = {
      userProfile: {},
    };
    const t = async () => {
      await SessionUser.getLoggedInUserPortalId(req);
    };
    await expect(t).rejects.toThrow('No user id found in session');
  });

  test('getLoggedInUser ok', async () => {
    const req = createRequest();
    req['__session'] = {
      userProfile: mockeduser as UserProfile,
    };
    const user = await SessionUser.getLoggedInUserPortalId(req);
    expect(user).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  });

  test('getLoggedInUserProfile no session', () => {
    const t = () => {
      SessionUser.getLoggedInUserProfile({} as Express.Request);
    };
    expect(t).toThrow('No session found');
  });

  test('getLoggedInUserProfile no user profile', () => {
    const req = createRequest();
    req['__session'] = {};
    const t = () => {
      SessionUser.getLoggedInUserProfile(req);
    };
    expect(t).toThrow('No userProfile found in session');
  });

  test('getLoggedInUserProfile ok', () => {
    const req = createRequest();
    req['__session'] = {
      userProfile: mockeduser as UserProfile,
    };
    const user = SessionUser.getLoggedInUserProfile(req);
    expect(user).toBe(mockeduser);
  });
});

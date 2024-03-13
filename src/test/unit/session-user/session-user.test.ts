/* eslint-disable jest/expect-expect */
import { SessionUser } from '../../../main/services/session-user/session-user';
import { createRequest } from 'node-mocks-http';
import { UserProfile } from '../../../main/types/user-profile';
import { mockeduser } from '../test-helper';

describe('Session Users', () => {
  test('getLoggedInUser no session', async () => {
    const t = () => {
      SessionUser.getLoggedInUserPortalId({} as Express.Request);
    };
    expect(t).toThrow(Error);
    expect(t).toThrow('No session found');
  });

  test('getLoggedInUser no userProfile', async () => {
    const req = createRequest();
    req['__session'] = {};
    const t = () => {
      SessionUser.getLoggedInUserPortalId(req);
    };
    expect(t).toThrow(Error);
    expect(t).toThrow('No userProfile found in session');
  });

  test('getLoggedInUserPortalId no user id', async () => {
    const req = createRequest();
    req['__session'] = {
      userProfile: {},
    };
    const t = () => {
      SessionUser.getLoggedInUserPortalId(req);
    };
    expect(t).toThrow(Error);
    expect(t).toThrow('No user id found in session');
  });

  test('getLoggedInUser ok', async () => {
    const req = createRequest();
    req['__session'] = {
      userProfile: mockeduser as UserProfile,
    };
    const user = SessionUser.getLoggedInUserPortalId(req);
    expect(user).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  });
});

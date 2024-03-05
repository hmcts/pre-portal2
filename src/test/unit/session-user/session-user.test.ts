/* eslint-disable jest/expect-expect */
import { SessionUser } from '../../../main/services/session-user/session-user';
import { createRequest } from 'node-mocks-http';
import { UserProfile } from '../../../main/types/user-profile';

describe('Session Users', () => {
  test('getLoggedInUser no session', async () => {
    const t = () => {
      SessionUser.getLoggedInUser({} as Express.Request);
    };
    expect(t).toThrow(Error);
    expect(t).toThrow('No session found');
  });

  test('getLoggedInUser no userProfile', async () => {
    const req = createRequest();
    req['__session'] = {};
    const t = () => {
      SessionUser.getLoggedInUser(req);
    };
    expect(t).toThrow(Error);
    expect(t).toThrow('No userProfile found in session');
  });

  test('getLoggedInUser no user id', async () => {
    const req = createRequest();
    req['__session'] = {
      userProfile: {},
    };
    const t = () => {
      SessionUser.getLoggedInUser(req);
    };
    expect(t).toThrow(Error);
    expect(t).toThrow('No user id found in session');
  });

  test('getLoggedInUser ok', async () => {
    const req = createRequest();
    req['__session'] = {
      userProfile: {
        id: '5000e766-b50d-4473-85b2-0bb54785c169',
        court: {
          id: 'e2ca657c-8f4f-4d41-b545-c434bb779f20',
          name: 'Leeds Youth',
          court_type: 'CROWN',
          location_code: '',
          regions: [
            {
              name: 'Yorkshire and The Humber',
            },
          ],
          rooms: [],
        },
        role: {
          id: 'c920307f-5198-48c1-8954-d5277b415853',
          name: 'Super User',
          description: 'Super User',
          permissions: [],
        },
        last_access: null,
        active: true,
        user: {
          id: '9ffcc9fb-db21-4d77-a983-c39b01141c6a',
          first_name: 'Jason',
          last_name: 'Paige',
          email: 'jason.paige@hmcts.net',
          phone_number: null,
          organisation: null,
        },
      } as UserProfile,
    };
    const user = SessionUser.getLoggedInUser(req);
    expect(user.id).toBe('5000e766-b50d-4473-85b2-0bb54785c169');
  });
});

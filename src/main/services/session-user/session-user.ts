import { UserProfile } from '../../types/user-profile';

export class SessionUser {
  public static getLoggedInUserPortalId(req: Express.Request): string {
    if (!req['__session']) {
      throw new Error('No session found');
    }
    if (!req['__session'].userProfile) {
      throw new Error('No userProfile found in session');
    }
    const user = req['__session'].userProfile as UserProfile;
    if (!user.portal_access || !user.portal_access[0]) {
      throw new Error('No user id found in session');
    }
    return user.portal_access[0].id;
  }
}

import { UserProfile } from '../../types/user-profile';

export class SessionUser {
  public static getLoggedInUser(req: Express.Request): UserProfile {
    if (!req['__session']) {
      throw new Error('No session found');
    }
    if (!req['__session'].userProfile) {
      throw new Error('No userProfile found in session');
    }
    const user = req['__session'].userProfile as UserProfile;
    if (!user.id) {
      throw new Error('No user id found in session');
    }
    return user;
  }
}

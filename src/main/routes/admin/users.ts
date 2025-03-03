import { Application } from 'express';
import { getAllPaginatedCourts, getPaginatedPageTitle, getPaginationLinks } from '../../helpers/helpers';
import { PreClient } from '../../services/pre-api/pre-client';
import { SessionUser } from '../../services/session-user/session-user';
import { Pagination, SearchUsersRequest, User } from '../../services/pre-api/types';
import { requiresAuth } from 'express-openid-connect';
import { RequiresSuperUser } from '../../middleware/admin-middleware';

export default (app: Application): void => {
  app.get('/admin/users', requiresAuth(), RequiresSuperUser, async (req, res) => {
    const client = new PreClient();
    let userPortalId: string;
    try {
      userPortalId = await SessionUser.getLoggedInUserPortalId(req);
    } catch (e) {
      res.status(404);
      res.render('not-found');
      return;
    }

    const courts = await getAllPaginatedCourts(client, userPortalId, { size: 50 });
    const roles = await client.getRoles(userPortalId);

    const request: SearchUsersRequest = {
      firstName: req.query.firstName as string,
      lastName: req.query.lastName as string,
      email: req.query.email as string,
      organisation: req.query.organisation as string,
      roleId: req.query.roleId as string,
      courtId: req.query.courtId as string,
      page: req.query.page as unknown as number,
      size: 50,
    };

    let users: { users: User[]; pagination: Pagination };

    try {
      users = await client.getUsers(userPortalId, request);
    } catch (e) {
      res.status(404);
      res.render('not-found');
      return;
    }

    const filteredRole = req.query.roleId ? roles.filter(role => role.id === req.query.roleId)?.[0] : null;

    res.render('admin/users', {
      isSuperUser: true,
      pageUrl: req.url,
      roles,
      params: req.query,
      isFilteredByPortalAccess: filteredRole?.name === 'Level 3',
      title: getPaginatedPageTitle('Users', users.users, users.pagination),
      paginationLinks: getPaginationLinks(users.pagination, '/admin/users', request),
      users: users.users.map(user => {
        return {
          ...user,
          court:
            (user.app_access.filter(access => access.default_court)[0]?.court.name ?? user.app_access.length === 1)
              ? user.app_access[0].court.name
              : 'N/A',
          highestRole:
            user.app_access.filter(access => access.default_court)[0]?.role.name ??
            (user.portal_access.length > 0
              ? 'Level 3'
              : user.app_access.length === 1
                ? user.app_access[0].role.name
                : 'N/A'),
        };
      }),
      courts: courts.map(court => {
        return {
          id: court.id,
          name: court.name,
        };
      }),
    });
  });
};

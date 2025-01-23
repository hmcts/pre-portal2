import { SearchAuditLogsRequest } from 'services/pre-api/types';
import { PreClient } from '../services/pre-api/pre-client';
import { SessionUser } from '../services/session-user/session-user';

import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { UserLevel } from '../types/user-level';
import { NotFoundError } from '../types/errors';

export default function (app: Application): void {
  app.get('/audit', requiresAuth(), async (req, res) => {
    const client = new PreClient();

    const isSuperUser =
      SessionUser.getLoggedInUserProfile(req).app_access.filter(role => role.role.name === UserLevel.SUPER_USER)
        .length > 0;

    try {
      if (isSuperUser) {
        const request: SearchAuditLogsRequest = {
          page: req.query.page as unknown as number,
          size: 10,
        };

        const { auditLogs, pagination } = await client.getAuditLogs(
          await SessionUser.getLoggedInUserProfile(req).app_access.filter(
            role => role.role.name === UserLevel.SUPER_USER
          )?.[0].id,
          request
        );

        const { paginationLinks, title } = client.createPagination(pagination, 'audit', 'Audit Logs', auditLogs.length);

        res.render('audit', {
          auditLogs,
          paginationLinks,
          title,
        });
      } else {
        throw new NotFoundError();
      }
    } catch (err) {
      res.status(404);
      res.render('not-found');
      return;
    }
  });
}

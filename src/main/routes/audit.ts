import { SearchAuditLogsRequest } from 'services/pre-api/types';
import { PreClient } from '../services/pre-api/pre-client';
import { SessionUser } from '../services/session-user/session-user';

import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { UserLevel } from '../types/user-level';
import { ForbiddenError } from '../types/errors';

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
          await SessionUser.getLoggedInUserPortalId(req),
          request
        );

        const paginationLinks = {
          previous: {},
          next: {},
          items: [] as ({ href: string; number: number; current: boolean } | { ellipsis: boolean })[],
        };

        // Add previous link if not on the first page
        if (pagination.currentPage > 0) {
          paginationLinks.previous = {
            href: `/audit?page=${pagination.currentPage - 1}`,
          };
        }

        // Add next link if not on the last page
        if (pagination.currentPage < pagination.totalPages - 1) {
          paginationLinks.next = {
            href: `/audit?page=${pagination.currentPage + 1}`,
          };
        }

        // Always add the first page
        paginationLinks.items.push({
          href: '/audit?page=0',
          number: 1,
          current: 0 === pagination.currentPage,
        });

        // Add an ellipsis after the first page if the 2nd page is not in the window
        if (pagination.currentPage > 3) {
          paginationLinks.items.push({ ellipsis: true });
        }

        // Add the pages immediately 2 before and 2 after the current page to create a rolling window of 5 pages
        for (
          let i = Math.max(1, pagination.currentPage - 2);
          i <= Math.min(pagination.currentPage + 2, pagination.totalPages - 2);
          i++
        ) {
          paginationLinks.items.push({
            href: `/audit?page=${i}`,
            number: i + 1,
            current: i === pagination.currentPage,
          });
        }

        // Add an ellipsis before the last page if the 2nd last page is not in the window
        if (pagination.currentPage < pagination.totalPages - 4) {
          paginationLinks.items.push({ ellipsis: true });
        }

        // Add the last page if there is more than one page (don't repeat the first page)
        if (pagination.totalPages > 1) {
          paginationLinks.items.push({
            href: `/audit?page=${pagination.totalPages - 1}`,
            number: pagination.totalPages,
            current: pagination.totalPages - 1 === pagination.currentPage,
          });
        }

        let title = 'Audit Logs';
        if (auditLogs.length > 0) {
          title = `Audit Logs ${pagination.currentPage * pagination.size + 1} to ${Math.min(
            (pagination.currentPage + 1) * pagination.size,
            pagination.totalElements
          )} of ${pagination.totalElements}`;
        }

        res.render('audit', {
          auditLogs,
          paginationLinks,
          title,
        });
      } else {
        throw new ForbiddenError();
      }
    } catch (err) {
      if (isSuperUser) {
        res.status(500);
        res.render('error', { status: err.status, message: err.message });
        return;
      } else {
        res.status(404);
        res.render('not-found');
        return;
      }
    }
  });
}

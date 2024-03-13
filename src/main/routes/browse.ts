import { PreClient } from '../services/pre-api/pre-client';
import { SearchRecordingsRequest } from '../services/pre-api/types';
import { SessionUser } from '../services/session-user/session-user';

import { Logger } from '@hmcts/nodejs-logging';
import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';

export default function (app: Application): void {
  const logger = Logger.getLogger('browse');

  app.get('/browse', requiresAuth(), async (req, res) => {
    try {
      const client = new PreClient();

      const request: SearchRecordingsRequest = {
        captureSessionId: req.query.captureSessionId as string,
        parentRecordingId: req.query.parentRecordingId as string,
        participantId: req.query.participantId as string,
        witnessName: req.query.witnessName as string,
        defendantName: req.query.defendantName as string,
        caseReference: req.query.caseReference as string,
        scheduledFor: req.query.scheduledFor as string,
        courtId: req.query.courtId as string,
        includeDeleted: req.query.includeDeleted as unknown as boolean,
        page: req.query.page as unknown as number,
        size: 10,
      };

      const { recordings, pagination } = await client.getRecordings(SessionUser.getLoggedInUserPortalId(req), request);

      const paginationLinks = {
        previous: {},
        next: {},
        items: [] as ({ href: string; number: number; current: boolean } | { ellipsis: boolean })[],
      };

      if (pagination.currentPage > 0) {
        paginationLinks.previous = {
          href: `/browse?page=${pagination.currentPage - 1}`,
        };
      }

      if (pagination.currentPage < pagination.totalPages - 1) {
        paginationLinks.next = {
          href: `/browse?page=${pagination.currentPage + 1}`,
        };
      }

      // Always add the first page
      paginationLinks.items.push({
        href: '/browse?page=0',
        number: 1,
        current: 0 === pagination.currentPage,
      });

      // Add an ellipsis if the current page is more than 2 pages away from the first page
      if (pagination.currentPage > 2) {
        paginationLinks.items.push({ ellipsis: true });
      }

      // Add the pages immediately 2 before and 2 after the current page
      if (pagination.totalPages > 2) {
        for (
          let i = Math.max(2, pagination.currentPage - 2);
          i <= Math.min(pagination.currentPage + 2, pagination.totalPages - 2);
          i++
        ) {
          paginationLinks.items.push({
            href: `/browse?page=${i}`,
            number: i + 1,
            current: i === pagination.currentPage,
          });
        }
      }

      // Add an ellipsis if the current page is more than 2 pages away from the last page
      if (pagination.currentPage < pagination.totalPages - 3) {
        paginationLinks.items.push({ ellipsis: true });
      }

      // Always add the last page
      if (pagination.totalPages > 0) {
        paginationLinks.items.push({
          href: `/browse?page=${pagination.totalPages - 1}`,
          number: pagination.totalPages,
          current: pagination.totalPages - 1 === pagination.currentPage,
        });
      }

      let title = 'Recordings';
      if (recordings.length > 0) {
        title = `Recordings ${pagination.currentPage * pagination.size + 1} to ${Math.min(
          (pagination.currentPage + 1) * pagination.size,
          pagination.totalElements
        )} of ${pagination.totalElements}`;
      }

      res.render('browse', {
        recordings,
        paginationLinks,
        title,
        user: req.oidc?.user,
      });
    } catch (e) {
      res.status(500);
      res.render('error', { message: e.message });
      logger.error(e.message);
    }
  });
}

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

      const recordings = await client.getRecordings(SessionUser.getLoggedInUser(req).id, request);

      res.render('browse', {
        recordings,
        user: req.oidc?.user,
      });
    } catch (e) {
      res.status(500);
      res.render('error', { message: e.message });
      logger.error(e.message);
    }
  });
}

import { PreClient } from '../services/pre-api/pre-client';
import { SearchRecordingsRequest } from '../services/pre-api/types';

import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';

export default function (app: Application): void {
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

      const recordings = await client.getRecordings(request);

      if (!recordings) {
        throw new Error('Failed to retrieve recordings');
      }

      res.render('browse', {
        recordings,
        user: req.oidc?.user,
      });
    } catch (e) {
      res.status(500);
      res.render('error', { message: e.message });
    }
  });
}

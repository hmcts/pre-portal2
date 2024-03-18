import { PreClient } from '../services/pre-api/pre-client';
import { SessionUser } from '../services/session-user/session-user';

import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';

export default function (app: Application): void {
  app.get('/watch/:id', requiresAuth(), async (req, res) => {
    try {
      const client = new PreClient();

      const recording = await client.getRecording(await SessionUser.getLoggedInUserPortalId(req), req.params.id);

      if (recording === null) {
        res.status(404);
        res.render('not-found');
        return;
      }

      const recordingPlaybackData = await client.getRecordingPlaybackData(req.params.id);

      if (recordingPlaybackData === null) {
        res.status(404);
        res.render('not-found');
        return;
      }

      res.render('watch', { recording, recordingPlaybackData });
    } catch (e) {
      console.log('Error in watch route', e.message);
      res.status(500);
      res.render('error', { message: e.message });
    }
  });
}

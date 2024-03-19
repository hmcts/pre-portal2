import { PreClient } from '../services/pre-api/pre-client';
import { SessionUser } from '../services/session-user/session-user';

import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';

function validateId(id: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

export default function (app: Application): void {
  app.get('/watch/:id', requiresAuth(), async (req, res) => {
    if (!validateId(req.params.id)) {
      res.status(404);
      res.render('not-found');
      return;
    }

    try {
      const client = new PreClient();

      const recording = await client.getRecording(await SessionUser.getLoggedInUserPortalId(req), req.params.id);

      if (recording === null) {
        res.status(404);
        res.render('not-found');
        return;
      }

      const recordingPlaybackDataUrl = `/watch/${req.params.id}/playback`;

      res.render('watch', { recording, recordingPlaybackDataUrl });
    } catch (e) {
      console.log('Error in watch route', e.message);
      res.status(500);
      res.render('error', { status: 500, message: e.message });
    }
  });

  app.get('/watch/:id/playback', requiresAuth(), async (req, res) => {
    if (!validateId(req.params.id)) {
      res.status(404);
      res.json({ message: 'Not found' });
      return;
    }

    try {
      const client = new PreClient();

      const recordingPlaybackData = await client.getRecordingPlaybackData(
        await SessionUser.getLoggedInUserPortalId(req),
        req.params.id
      );

      if (recordingPlaybackData === null) {
        res.status(404);
        res.json({ message: 'Not found' });
        return;
      }

      res.json(recordingPlaybackData);
    } catch (e) {
      console.log('Error in watch playback route', e.message);
      res.status(500);
      res.json({ message: e.message });
    }
  });
}

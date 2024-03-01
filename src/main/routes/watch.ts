import { PreClient } from '../services/pre-api/pre-client';

import { Application } from 'express';

export default function (app: Application): void {
  app.get('/watch/:id', async (req, res) => {
    try {
      const client = new PreClient();

      const recording = await client.getRecording(req.params.id);

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
      res.status(500);
      res.render('error', { message: e.message });
    }
  });
}

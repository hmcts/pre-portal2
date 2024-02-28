import { PreClient } from '../services/pre-api/pre-client';

import { Application } from 'express';

export default function (app: Application): void {
  app.get('/watch/:id', async (req, res) => {
    try {
      const client = new PreClient();

      const recording = await client.getRecording(req.params.id);
      const recordingPlaybackData = await client.getRecordingPlaybackData(req.params.id);

      if (!recording || !recordingPlaybackData) {
        throw new Error('Failed to retrieve recording');
      }

      res.render('watch', { recording, recordingPlaybackData });
    } catch (e) {
      res.status(500);
      res.render('error', { message: e.message });
    }
  });
}

import { PreClient } from '../services/pre-api/pre-client';

import { Application } from 'express';


export default function (app: Application): void {
  app.get('/watch/:id', async (req, res) => {
    try {
      const client = new PreClient();

      const recording = await client.getRecording(req.params.id);

      if (!recording) {
        throw new Error('Failed to retrieve recording');
      }

      const captureSession = recording.captureSession;

      res.render('watch', { captureSession, recording});
    } catch (e) {
      res.status(500);
      res.render('error');
    }
  });
}

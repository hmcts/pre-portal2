import { PreClient } from '../services/pre-api/pre-client';

import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';

export default function (app: Application): void {
  app.get('/watch/:id', requiresAuth(), async (req, res) => {
    try {
      const client = new PreClient();

      const recording = await client.getRecording(req.params.id);

      if (!recording) {
        throw new Error('Failed to retrieve recording');
      }

      res.render('watch', { recording });
    } catch (e) {
      res.status(500);
      res.render('error', { message: e.message });
    }
  });
}

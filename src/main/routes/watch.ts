import { PreClient } from '../services/pre-api/pre-client';

import { Application } from 'express';


export default function (app: Application): void {
  app.get('/watch/:id', async (req, res) => {
    try {
      const client = new PreClient();

      const recording = await client.getRecording(req.params.id);
      res.render('watch', { recording });
    } catch (e) {

    }
  });
}

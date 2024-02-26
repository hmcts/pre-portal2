import { PreClient } from '../services/pre-api/pre-client';
import { SearchCaptureSessionsRequest } from '../services/pre-api/types';

import { Application } from 'express';


export default function (app: Application): void {
  app.get('/browse', async (req, res) => {
    try {
      const client = new PreClient();

      // TODO: Use search parameters from request
      const request: SearchCaptureSessionsRequest = {

      };

      // TODO: Insert API response to to template
      const recordings = await client.getCaptureSessions(request);
      res.render('browse');
    } catch (e) {

    }

  });
}

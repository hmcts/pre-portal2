import { PreClient } from '../services/pre-api/pre-client';
import { SearchCaptureSessionsRequest } from '../services/pre-api/types';

import { Application } from 'express';


export default function (app: Application): void {
  app.get('/browse', async (req, res) => {
    try {
      const client = new PreClient();

      const request: SearchCaptureSessionsRequest = {
        caseReference: req.query.caseReference as string,
        bookingId: req.query.bookingId as string,
        origin: 'PRE',
        recordingStatus: 'RECORDING_AVAILABLE',
        scheduledFor: req.query.scheduledFor as string,
        page: req.query.page as unknown as number,
        size: 10
      };

      const recordings = await client.getCaptureSessions(request);
      res.render('browse', { recordings });
    } catch (e) {

    }

  });
}

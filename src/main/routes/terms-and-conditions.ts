import { PreClient } from '../services/pre-api/pre-client';

import { Application } from 'express';

export default function (app: Application): void {
  app.get('/terms-and-conditions', (req, res) => {
    const client = new PreClient();
    const terms = client.getLatestTermsAndConditions();

    res.render('terms-and-conditions', { terms });
  });
}

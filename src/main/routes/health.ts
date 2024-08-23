import os from 'os';

import healthcheck from '@hmcts/nodejs-healthcheck';
import { Application } from 'express';

export default async function (app: Application): Promise<void> {
  healthcheck.addTo(app, {
    checks: {},
    buildInfo: {
      name: 'pre-portal',
      host: os.hostname(),
      uptime: process.uptime(),
    },
  });
}

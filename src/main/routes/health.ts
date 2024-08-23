import os from 'os';

import { PreClient } from '../services/pre-api/pre-client';

import healthcheck from '@hmcts/nodejs-healthcheck';
import { Logger } from '@hmcts/nodejs-logging';
import { Application } from 'express';

export default async function (app: Application): Promise<void> {
  // const redis = app.locals.redisClient
  //   ? healthcheck.raw(() => app.locals.redisClient.ping().then(healthcheck.up).catch(healthcheck.down))
  //   : null;
  if (app.locals.redisClient) {
    const logger = Logger.getLogger('health');
    const result = await app.locals.redisClient.ping();
    logger.info('redis ping result: ' + result);
  }

  healthcheck.addTo(app, {
    checks: {
      // currently no API health check is possible for B2C
      'pre-api': healthcheck.raw(() => {
        const client = new PreClient();
        return client.healthCheck().then(healthcheck.up).catch(healthcheck.down);
      }),
    },
    buildInfo: {
      name: 'pre-portal',
      host: os.hostname(),
      uptime: process.uptime(),
    },
  });
}

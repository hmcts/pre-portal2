import os from 'os';

import { PreClient } from '../services/pre-api/pre-client';

import healthcheck from '@hmcts/nodejs-healthcheck';
import { Application } from 'express';

export default function (app: Application): void {
  const redis = app.locals.redisClient
    ? healthcheck.raw(() => app.locals.redisClient.ping().then(healthcheck.up).catch(healthcheck.down))
    : null;

  healthcheck.addTo(app, {
    checks: {
      // currently no API health check is possible for B2C
      ...(redis ? { redis } : {}),
      'pre-api': healthcheck.raw(() => {
        const client = new PreClient();
        return client.healthCheck().then(healthcheck.up).catch(healthcheck.down);
      }),
    },
    ...(redis
      ? {
          readinessChecks: {
            // allow the frontend to start up without the API but not without redis.
            redis,
          },
        }
      : {}),
    buildInfo: {
      name: 'pre-portal',
      host: os.hostname(),
      uptime: process.uptime(),
    },
  });
}

import os from 'os';

import healthcheck from '@hmcts/nodejs-healthcheck';
import config from 'config';
import { Application } from 'express';

export default function (app: Application): void {
  const redis = app.locals.redisClient
    ? healthcheck.raw(() => app.locals.redisClient.ping().then(healthcheck.up).catch(healthcheck.down))
    : null;

  healthcheck.addTo(app, {
    checks: {
      // currently no API health check is possible for B2C
      ...(redis ? { redis } : {}),
      'pre-api': healthcheck.web(new URL('/health', config.get('pre.apiUrl'))),
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

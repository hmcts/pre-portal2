import os from 'os';

import { PreClient } from '../services/pre-api/pre-client';

import healthcheck from '@hmcts/nodejs-healthcheck';
import { Application } from 'express';
// import {Logger} from "@hmcts/nodejs-logging";

export default function (app: Application): void {
  const redis = app.locals.redisClient
    ? healthcheck.raw(() => app.locals.redisClient.ping().then(healthcheck.up).catch(healthcheck.down))
    : null;

  // const logger = Logger.getLogger('health');

  healthcheck.addTo(app, {
    checks: {
      // currently no API health check is possible for B2C
      ...(redis ? { redis } : {}),
      'pre-api': async () => {
        try {
          const client = new PreClient();
          const r = await client.healthCheck();
          if (r.data.status === 'UP') {
            return healthcheck.up();
          }
          return healthcheck.down();
        } catch (e) {
          return healthcheck.down();
        }
      },
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

import { PreClient } from '../services/pre-api/pre-client';

import { Logger } from '@hmcts/nodejs-logging';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/bulk-update-users', () => {
    const logger = Logger.getLogger('bulk-update-users');
    const client = new PreClient();
    const xUserId = 'da940fcc-380d-4209-b385-31a76311975a';
    const usersToUpdate = [{ from: 'from@somewhere.com', to: 'somwhere@else.net' }];

    usersToUpdate.forEach(async user => {
      try {
        logger.info(`Updating user ${user.from} to ${user.to}`);
        if (await client.updateUser(user.from, user.to, xUserId)) {
          logger.info(`User ${user.from} successfully updated to ${user.to}`);
        } else {
          logger.warn(`User ${user.from} failed to update to ${user.to}`);
        }
      } catch (e) {
        logger.error(e.message());
        logger.warn(`User ${user.from} failed to update to ${user.to}`);
      }
    });
  });
}

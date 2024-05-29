import { PreClient } from '../services/pre-api/pre-client';

import { Logger } from '@hmcts/nodejs-logging';
import { Application } from 'express';

import * as fs from "fs";
import * as path from "path";
import csvParser from 'csv-parser';

export default function (app: Application): void {
  app.get('/bulk-update-users', () => {
    const logger = Logger.getLogger('bulk-update-users');
    const client = new PreClient();
    // const xUserId = 'da940fcc-380d-4209-b385-31a76311975a';
    // const usersToUpdate = [{ from: 'from@somewhere.com', to: 'somwhere@else.net' }];
    const csvFilePath = path.resolve('__dirname', '');
    const usersToUpdate: { from: string; to: string }[] = [];

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        usersToUpdate.push({ from: row['email'], to: row['migrated email'] });
      })
      .on('end', async () => {
        logger.info('CSV file successfully processed');
        
        usersToUpdate.forEach(async user => {
          try {
            logger.info(`Fetching user_id for user ${user.from}`);
            const userProfile = await client.getUserByEmail(user.from);
            const xUserId = userProfile.user.id;

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
      })
  });
}

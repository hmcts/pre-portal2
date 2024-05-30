import { PreClient } from '../services/pre-api/pre-client';

import { Logger } from '@hmcts/nodejs-logging';
import { Application } from 'express';

import * as fs from "fs";
import * as path from "path";
import csvParser from 'csv-parser';

export default function (app: Application): void {
  app.get('/bulk-update-users', async(req, res) => {
    const logger = Logger.getLogger('bulk-update-users');
    const client = new PreClient();
    const csvFilePath = path.resolve('__dirname', '');
    const usersToUpdate: { from: string; to: string }[] = [];
    const isDryRun = req.query.dryRun === 'true';

    try{
      await processCsvFile(csvFilePath, usersToUpdate, logger, client, isDryRun)
      res.send('Bulk update users process completed');
    } catch (e) {
      logger.error(e.message());
    }
  });
}


async function processCsvFile(
  csvFilePath: string,
  usersToUpdate: {from: string, to: string}[],
  logger: any,
  client: PreClient,
  isDryRun: boolean 
): Promise<void>{
  await new Promise((resolve, reject)=>{
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        usersToUpdate.push({ from: row['email'], to: row['migrated email'] });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  logger.info('CSV file successfully processed');

  for (const user of usersToUpdate) {
    try {
      logger.info(`Fetching user_id for user ${user.from}`);
      const userProfile = await client.getUserByEmail(user.from);
      const xUserId = userProfile.user.id;
      
      if (isDryRun){
        logger.info(`[Dry Run] Would update user ${user.from} to ${user.to} for user_id ${xUserId}`);
        continue
      } 

      logger.info(`Updating user ${user.from} to ${user.to}`);
      if (!(await client.updateUser(user.from, user.to, xUserId))) {
        logger.warn(`User ${user.from} failed to update to ${user.to}`);
        continue
      }

      logger.info(`User ${user.from} successfully updated to ${user.to}`);
      if (await client.resetUserPortalAccessForReinvite(user.to, xUserId)) {
        logger.info(`User ${user.to} portal access successfully reset`);
      } else {
        logger.warn(`Failed to reset portal access for user ${user.to}`);
      }
      
    } catch (e) {
      logger.error(e.message());
      logger.warn(`User ${user.from} failed to update to ${user.to}`);
    };
  };
};
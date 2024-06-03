import { PreClient } from '../services/pre-api/pre-client';

import { Logger } from '@hmcts/nodejs-logging';
import { Application } from 'express';

import * as fs from "fs";
import * as path from "path";
import csvParser from 'csv-parser';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';


export default function (app: Application): void {
  app.get('/bulk-update-users', async(req, res) => {
    const logger = Logger.getLogger('bulk-update-users');
    const client = new PreClient();
    const csvFilePath = path.resolve('data','dummyData.csv');
    const xUserId = '0cec8880-f44f-4d14-a0a6-6bee2cb9add6' // valid app_access id
    const usersToUpdate: { from: string; to: string }[] = [];
    const isDryRun = req.query.dryRun === 'true';
    const results: {firstName: string, lastName: string, from: string; to: string; status: string }[] = [];

    try{
      await processCsvFile(csvFilePath, xUserId, usersToUpdate, logger, client, isDryRun, results)

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const resultFileName = `updateResults_${timestamp}.csv`;
      await writeResultsToCsv(results, resultFileName);

      res.send('Bulk update users process completed\n');   

    } catch (e) {
      logger.error(e.message);
    }
  });
}


async function processCsvFile(
  csvFilePath: string,
  xUserId : string,
  usersToUpdate: {from: string, to: string}[],
  logger: any,
  client: PreClient,
  isDryRun: boolean,
  results: {firstName: string, lastName: string, from: string, to: string, status: string}[],
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
      const userProfile = await client.getUserByEmail(user.from);
      if (!userProfile) {
        logger.warn(`User profile not found for user:  ${user.from}`);
        results.push({ firstName: '', lastName: '', ...user, status: 'Profile Not Found' });
        continue;
      }
      const { first_name, last_name } = userProfile.user;

      if (isDryRun){
        logger.info(`[Dry Run] Would update user ${user.from} to ${user.to} for user_id ${xUserId}`);
        results.push({ firstName: first_name, lastName:last_name, ...user, status: 'Dry Run' });
        continue
      } 

      logger.info(`Updating user ${user.from} to ${user.to}`);
      if (await client.updateUser(user.from, user.to, xUserId)) {
        logger.info(`User ${user.from} successfully updated to ${user.to}`);
        results.push({firstName: first_name, lastName:last_name, ...user,  status: 'Updated' });

        if (await client.resetUserPortalAccessForReinvite(user.to, xUserId)) {
          logger.info(`User ${user.to} portal access successfully reset`);
        } else {
          logger.warn(`Failed to reset portal access for user ${user.to}`);
        }

      } else {
        logger.warn(`User ${user.from} failed to update to ${user.to}`);
        results.push({ firstName: first_name, lastName:last_name,...user, status: 'Update Failed' });
        continue
      }

    } catch (e) {
      logger.error(e.message);
      logger.error('CSVfunc: ',e.data)
      logger.warn(`User ${user.from} failed to update to ${user.to}`);
      results.push({ firstName: '', lastName:'', ...user, status: `Error ${e}` });
    };
  };
};

async function writeResultsToCsv(results: { from: string, to: string, status: string }[], fileName: string): Promise<void> {
  const csvWriter = createCsvWriter({
    path: path.resolve('data', fileName),
    header: [
      { id: 'firstName', title: 'First Name' },
      { id: 'lastName', title: 'Last Name' },
      { id: 'from', title: 'From' },
      { id: 'to', title: 'To' },
      { id: 'status', title: 'Status' }
    ]
  });

  await csvWriter.writeRecords(results);
}
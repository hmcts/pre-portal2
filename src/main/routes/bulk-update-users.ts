import * as fs from 'fs';
import * as path from 'path';

import { PreClient } from '../services/pre-api/pre-client';
import { AccessStatus } from '../types/access-status';
import { User } from '../types/user';

import { Logger } from '@hmcts/nodejs-logging';
import csvParser from 'csv-parser';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { Application } from 'express';

interface UpdateUserResult {
  firstName: string;
  lastName: string;
  fromEmail: string;
  toEmail: string;
  status: string;
  emailUpdated: string | null;
  portalAccessReset: string | null;
  newInvitationCreated: string | null;
}

export default function (app: Application): void {
  app.get('/bulk-update-users', async (req, res) => {
    const startTime = Date.now();
    const logger = Logger.getLogger('bulk-update-users');
    const client = new PreClient();
    const csvFilePath = path.resolve('data', 'dummyData.csv');
    const xUserId = 'd340c8f2-b733-4b49-82f5-5708b7a03711'; // valid app_access id
    const usersToUpdate: { from: string; to: string }[] = [];
    const isDryRun = req.query.dryRun === 'true';

    try {
      const results = await processCsvFile(csvFilePath, xUserId, usersToUpdate, client, isDryRun);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const resultFileName = `updateResults_${timestamp}.csv`;
      await writeResultsToCsv(results, resultFileName);

      res.send('Bulk update users process completed in ' + (Date.now() - startTime) + 'ms');
    } catch (e) {
      logger.error(e.message);
    }
  });
}

async function processCsvFile(
  csvFilePath: string,
  xUserId: string,
  usersToUpdate: { from: string; to: string }[],
  client: PreClient,
  isDryRun: boolean
): Promise<UpdateUserResult[]> {
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', row => {
        usersToUpdate.push({ from: row['email'], to: row['migrated email'] });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  const logger = Logger.getLogger('bulk-update-users');

  logger.info('CSV file successfully processed');

  const results: UpdateUserResult[] = [];

  for (const user of usersToUpdate) {
    try {
      const userProfile = await client.getUserByEmail(user.from);
      if (!userProfile) {
        logger.warn(`User profile not found for user:  ${user.from}`);
        results.push({
          firstName: '',
          lastName: '',
          fromEmail: user.from,
          toEmail: user.to,
          status: 'Profile Not Found',
          emailUpdated: 'false',
          portalAccessReset: 'false',
          newInvitationCreated: 'false',
        });
        continue;
      }

      const fullUser: User = await client.getUserById(userProfile.user.id, xUserId);

      const { first_name, last_name } = userProfile.user;

      if (isDryRun) {
        logger.info(`[Dry Run] Would update user ${user.from} to ${user.to} for user_id ${xUserId}`);
        results.push({
          firstName: first_name,
          lastName: last_name,
          fromEmail: user.from,
          toEmail: user.to,
          status: 'Dry Run Success',
          emailUpdated: 'false',
          portalAccessReset: 'false',
          newInvitationCreated: 'false',
        });
        continue;
      }

      logger.info(`Updating user ${user.from} to ${user.to}`);
      logger.info(JSON.stringify(fullUser));
      fullUser.email = user.to;
      let portalAccessUpdated = false;
      if (
        fullUser.portal_access &&
        fullUser.portal_access[0] &&
        fullUser.portal_access[0].status !== AccessStatus.INACTIVE
      ) {
        fullUser.portal_access[0].invited_at = new Date().toISOString();
        fullUser.portal_access[0].registered_at = '';
        fullUser.portal_access[0].status = AccessStatus.INVITATION_SENT;
        portalAccessUpdated = true;
      }

      if (!(await client.updateUser(fullUser, xUserId))) {
        logger.warn(`User ${user.from} failed to update to ${user.to}`);
        results.push({
          firstName: first_name,
          lastName: last_name,
          fromEmail: user.from,
          toEmail: user.to,
          status: 'Email Update Failed',
          emailUpdated: 'false',
          portalAccessReset: 'false',
          newInvitationCreated: 'false',
        });
        continue;
      }

      logger.info(`User ${user.from} successfully updated to ${user.to}`);

      if (!portalAccessUpdated) {
        logger.info(`Not re-inviting user ${user.from} to portal as they are currently not active`);
        logger.info(JSON.stringify(fullUser));
        results.push({
          firstName: first_name,
          lastName: last_name,
          fromEmail: user.from,
          toEmail: user.to,
          status: 'Partial Success',
          emailUpdated: 'true',
          portalAccessReset: 'false',
          newInvitationCreated: 'false',
        });
        continue;
      }

      if (!(await client.sendInvite(userProfile, xUserId))) {
        logger.warn(`Failed to create portal invite for user ${user.to}`);
        results.push({
          firstName: first_name,
          lastName: last_name,
          fromEmail: user.from,
          toEmail: user.to,
          status: 'Failed to create portal invite',
          emailUpdated: 'true',
          portalAccessReset: 'true',
          newInvitationCreated: 'false',
        });
        continue;
      }

      logger.info(`User ${user.to} portal invite successfully created`);

      results.push({
        firstName: first_name,
        lastName: last_name,
        fromEmail: user.from,
        toEmail: user.to,
        status: 'Success',
        emailUpdated: 'true',
        portalAccessReset: 'true',
        newInvitationCreated: 'true',
      });
    } catch (e) {
      logger.error(e.message);
      logger.error('CSVfunc: ', e.data);
      logger.warn(`User ${user.from} failed to update to ${user.to}`);
      results.push({
        firstName: '',
        lastName: '',
        fromEmail: user.from,
        toEmail: user.to,
        status: `Error ${e}`,
        emailUpdated: null,
        portalAccessReset: null,
        newInvitationCreated: null,
      });
    }
  }
  return results;
}

async function writeResultsToCsv(results: UpdateUserResult[], fileName: string): Promise<void> {
  const csvWriter = createCsvWriter({
    path: path.resolve('data', fileName),
    header: [
      { id: 'firstName', title: 'First Name' },
      { id: 'lastName', title: 'Last Name' },
      { id: 'fromEmail', title: 'From' },
      { id: 'toEmail', title: 'To' },
      { id: 'status', title: 'Status' },
      { id: 'emailUpdated', title: 'Email Updated' },
      { id: 'portalAccessReset', title: 'Portal Access Reset' },
      { id: 'newInvitationCreated', title: 'New Invitation Created' },
    ],
  });

  await csvWriter.writeRecords(results);
}

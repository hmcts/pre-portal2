import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { SessionUser } from '../services/session-user/session-user';
import { PreClient } from '../services/pre-api/pre-client';
import { Logger } from '@hmcts/nodejs-logging';
import { v4 as uuid } from 'uuid';
import config from 'config';
import { PutEditInstruction, PutEditRequest } from '../services/pre-api/types';

const validateId = (id: string): boolean => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
};

const calculateTimeRemoved = (start: string, end: string): string => {
  const [h1, m1, s1] = start.split(':').map(Number);
  const [h2, m2, s2] = end.split(':').map(Number);

  const startTotalSeconds = h1 * 3600 + m1 * 60 + s1;
  const endTotalSeconds = h2 * 3600 + m2 * 60 + s2;

  const diffInSeconds = Math.abs(startTotalSeconds - endTotalSeconds);

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getCurrentEditRequest = async (
  client: PreClient,
  xUserId: string,
  sourceRecordingId: string
): Promise<PutEditRequest | null> => {
  const editRequests = await client.getMostRecentEditRequests(xUserId, sourceRecordingId);
  if (editRequests === null) {
    return null;
  }

  const editRequest = editRequests[0]
    ? ({
        id: editRequests[0].id,
        status: editRequests[0].status,
        source_recording_id: sourceRecordingId,
        edit_instructions: editRequests[0].edit_instruction.requestedInstructions,
        rejection_reason: editRequests[0].rejection_reason,
      } as PutEditRequest)
    : ({
        id: uuid(),
        status: 'DRAFT',
        source_recording_id: sourceRecordingId,
        edit_instructions: [] as PutEditInstruction[],
      } as PutEditRequest);

  editRequest.edit_instructions = editRequest.edit_instructions.map(i => {
    return {
      ...i,
      difference: calculateTimeRemoved(i.start_of_cut, i.end_of_cut),
    };
  });
  return editRequest;
};

const parseIsoDuration = (duration: string): number => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const hours = parseInt(matches[1] ?? 0, 10);
  const minutes = parseInt(matches[2] ?? 0, 10);
  const seconds = parseInt(matches[3] ?? 0);

  return hours * 3600 + minutes * 60 + seconds;
};

const validateInstruction = (instruction: PutEditInstruction, duration: string): Object => {
  const errors = {};

  const [h1, m1, s1] = instruction.start_of_cut.split(':').map(Number);
  const [h2, m2, s2] = instruction.end_of_cut.split(':').map(Number);
  const startTotalSeconds = h1 * 3600 + m1 * 60 + s1;
  const endTotalSeconds = h2 * 3600 + m2 * 60 + s2;

  const durationInSeconds = parseIsoDuration(duration);

  if (instruction.start_of_cut === '') {
    errors['startTime'] = 'Please enter a valid time reference';
  } else if (!instruction.start_of_cut.match('^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$')) {
    errors['startTime'] = 'The Start reference entered is not in the HH:MM:SS format';
  }

  if (instruction.end_of_cut === '') {
    errors['endTime'] = 'Please enter a valid time reference';
  } else if (!instruction.end_of_cut.match('^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$')) {
    errors['endTime'] = 'The End reference entered is not in the HH:MM:SS format';
  } else if (startTotalSeconds >= endTotalSeconds) {
    errors['endTime'] = 'End reference cannot be equal or less than the Start reference';
  } else if (endTotalSeconds > durationInSeconds) {
    errors['endTime'] = 'References cannot be greater than the duration of the recording';
  }
  return errors;
};

export const validateRequest = (editRequest: PutEditRequest, duration: string): Object | undefined => {
  for (let instruction of editRequest.edit_instructions) {
    const errors = validateInstruction(instruction, duration);
    if (Object.keys(errors).length > 0) {
      return errors;
    }
  }
};

export default (app: Application): void => {
  if (config.get('pre.enableAutomatedEditing')?.toString().toLowerCase() !== 'true') {
    return;
  }

  const logger = Logger.getLogger('edit-request');

  app.get('/edit-request/:id', requiresAuth(), async (req, res, next) => {
    if (!validateId(req.params.id)) {
      res.status(404);
      res.render('not-found');
      return;
    }

    try {
      const userPortalId = await SessionUser.getLoggedInUserPortalId(req);
      const userProfile = SessionUser.getLoggedInUserProfile(req);

      const client = new PreClient();
      const recording = await client.getRecording(userPortalId, req.params.id);

      if (recording === null) {
        res.status(404);
        res.render('not-found');
        return;
      }

      logger.info(`Recording ${recording.id} accessed by User ${userProfile.user.email}`);

      await client.putAudit(userPortalId, {
        id: uuid(),
        functional_area: 'Video Player',
        category: 'Recording',
        activity: 'Play',
        source: 'PORTAL',
        audit_details: {
          recordingId: recording.id,
          caseReference: recording.case_reference,
          caseId: recording.case_id,
          courtName: recording.capture_session.court_name,
          description: 'Recording accessed by User ' + userProfile.user.email,
          email: userProfile.user.email,
        },
      });

      const editRequest = await getCurrentEditRequest(client, userPortalId, recording.id);
      if (editRequest === null) {
        res.status(404);
        res.render('not-found');
        return;
      }

      const recordingPlaybackDataUrl = `/edit-request/${req.params.id}/playback`;
      const editRequestPostUrl = `/edit-request/${req.params.id}`;
      const mediaKindPlayerKey = config.get('pre.mediaKindPlayerKey');
      res.render('edit-request', {
        recording,
        recordingPlaybackDataUrl,
        editRequestPostUrl,
        mediaKindPlayerKey,
        editRequest,
      });
    } catch (e) {
      next(e);
    }
  });

  app.get('/edit-request/:id/playback', requiresAuth(), async (req, res) => {
    if (!validateId(req.params.id)) {
      res.status(404);
      res.json({ message: 'Not found' });
      return;
    }

    try {
      const client = new PreClient();
      const userPortalId = await SessionUser.getLoggedInUserPortalId(req);

      const recordingPlaybackData = await client.getRecordingPlaybackDataMk(userPortalId, req.params.id);

      if (recordingPlaybackData === null) {
        res.status(404);
        res.json({ message: 'Not found' });
        return;
      }

      res.json(recordingPlaybackData);
    } catch (e) {
      res.status(500);
      res.json({ message: e.message });
    }
  });

  app.post('/edit-request/:id', requiresAuth(), async (req, res, next) => {
    if (!validateId(req.params.id)) {
      res.status(404);
      res.render('not-found');
      return;
    }

    try {
      const client = new PreClient();
      const userPortalId = await SessionUser.getLoggedInUserPortalId(req);

      const recording = await client.getRecording(userPortalId, req.params.id);

      if (!recording) {
        res.status(404);
        res.render('not-found');
        return;
      }

      const errors = validateRequest(req.body, recording.duration);

      if (errors) {
        res.status(400);
        res.json({ errors });
        return;
      }

      await client.putEditRequest(userPortalId, req.body);
      res.json(await getCurrentEditRequest(client, userPortalId, req.params.id));
    } catch (e) {
      console.log(e);
      next(e);
    }
  });
};

import { PreClient } from '../services/pre-api/pre-client';
import { SessionUser } from '../services/session-user/session-user';

import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { v4 as uuid } from 'uuid';
import { isFlagEnabled, secondsToTimeString, timeStringToSeconds, validateId } from '../utils/helpers';
import { AppliedEditInstruction, PutEditInstruction, RecordingAppliedEdits } from '../services/pre-api/types';

const parseAppliedEdits = async (
  edits: string,
  client: PreClient,
  xUserId: string
): Promise<
  | {
      appliedEdits: AppliedEditInstruction[];
      approvedBy: string;
      approvedAt: string;
    }
  | undefined
> => {
  if (!edits || edits == '') {
    return;
  }
  const editInstructions = JSON.parse(edits) as RecordingAppliedEdits;
  if (!editInstructions.editInstructions || !editInstructions.editRequestId) {
    return;
  }

  const appliedEdits = editInstructions.editInstructions.requestedInstructions.map(
    (instruction: PutEditInstruction) =>
      ({
        startOfCut: instruction.start_of_cut,
        start: timeStringToSeconds(instruction.start_of_cut),
        endOfCut: instruction.end_of_cut,
        end: timeStringToSeconds(instruction.end_of_cut),
        reason: instruction.reason,
      }) as unknown as AppliedEditInstruction
  );

  let timeDifference = 0;
  for (const edit of appliedEdits) {
    edit.runtimeReference = secondsToTimeString(edit.start - timeDifference);
    timeDifference += edit.end - edit.start;
  }

  const editRequest = await client.getEditRequest(xUserId, editInstructions.editRequestId);
  return {
    appliedEdits,
    approvedBy: editRequest?.approved_by || '',
    approvedAt: editRequest?.approved_at ? new Date(editRequest.approved_at).toLocaleDateString() : '',
  };
};

export default function (app: Application): void {
  if (config.get('pre.enableMkWatchPage')?.toString().toLowerCase() !== 'true') {
    return;
  }

  const logger = Logger.getLogger('watch-mk');

  app.get('/watch-mk/:id', requiresAuth(), async (req, res) => {
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

      const recordingPlaybackDataUrl = `/watch-mk/${req.params.id}/playback`;
      const mediaKindPlayerKey = config.get('pre.mediaKindPlayerKey');
      const enableAutomatedEditing = isFlagEnabled('pre.enableAutomatedEditing');

      res.render('watch-mk', {
        recording,
        recordingPlaybackDataUrl,
        mediaKindPlayerKey,
        appliedEdits: enableAutomatedEditing
          ? await parseAppliedEdits(recording.edit_instructions, client, userPortalId)
          : undefined,
        enableAutomatedEditing,
      });
    } catch (e) {
      res.status(500);
      res.render('error', { status: 500, message: e.message });
    }
  });

  app.get('/watch-mk/:id/playback', requiresAuth(), async (req, res) => {
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
}

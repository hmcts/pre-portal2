import { PreClient } from '../services/pre-api/pre-client';

import axios from 'axios';
import config from 'config';
import { Application } from 'express';



export default function (app: Application): void {
  app.get('/watch/:id', async (req, res, next) => {
    try {
      const client = new PreClient(
        axios.create({
          baseURL: config.get('pre.apiUrl'),
          headers: {
            // TODO: Add API key from config
            Authorization: 'Bearer ' + config.get('pre.apiKey'),
            // TODO: Add user id from session
            'X-User-Id': '1234',
          },
        })
      );

      // TODO: Insert API response to to template
      const recordings = await client.getRecording(req.params.id);
      res.render('watch');
    } catch (e) {

    }
  });
}

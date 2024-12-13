import { Application } from 'express';
import { PreClient } from '../services/pre-api/pre-client';

import axios from 'axios';
import config from 'config';

export default function (app: Application): void {
  app.get('/admin/status', async (req, res) => {
    const client = new PreClient();

    const health = await client.healthCheck();

    const mediaKindConnections: { [key: string]: boolean } = health.data.components.preApi.details.mediakindConnections;

    let status = {
      api: {
        status: 'Down',
        components: {
          db: health.data.components.db.status,
          preApi: health.data.components.preApi.status,
          diskSpace: health.data.components.diskSpace.status,
          govNotify: 'DOWN',
        },
      },
      portal: {
        status: 'Down',
        components: {
          redis: 'DOWN',
          b2c: 'DOWN',
        },
      },
      mediaKind: {
        status: 'Down',
        components: {
          storage: 'DOWN',
        },
        connections: mediaKindConnections,
      },
      cvp: {
        status: 'Down',
        components: {
          conferencing: 'DOWN',
        },
      },
    };

    if (Object.values(status.mediaKind.connections).every(c => c)) {
      status.mediaKind.components.storage = 'UP';
    }

    // CVP Status

    try {
      const response = await axios.get('https://status-kinly.pexip.com/api/v2/status.json', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const description = response.data?.status?.description;

      if (description === 'All Systems Operational') {
        status.cvp.components.conferencing = 'UP';
      }
    } catch (error) {
      status.cvp.components.conferencing = 'ERROR';
      console.error('Error fetching cvp status:', error);
    }

    // GovNotify Status

    try {
      const response = await axios.get('https://status.notifications.service.gov.uk/api/v2/status.json', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const description = response.data?.status?.description;

      if (description === 'All Systems Operational') {
        status.api.components.govNotify = 'UP';
      }
    } catch (error) {
      status.api.components.govNotify = 'ERROR';
      console.error('Error fetching govnotify status:', error);
    }

    // Redis Status

    // app.locals.redisClient.ping().then(
    //   () => {
    //     status.portal.components.redis = "UP";
    //   }
    // ).catch();

    // B2C Status

    const b2cUrl = ((config.get('b2c.endSessionEndpoint') as string) +
      '?post_logout_redirect_uri=' +
      config.get('pre.portalUrl')) as string;

    try {
      const response = await axios.get(b2cUrl);

      if (response.status === 200) {
        status.portal.components.b2c = 'UP';
      }
    } catch (error) {}

    Object.values(status).forEach(service => {
      const serviceStatuses = Object.values(service.components);

      if (serviceStatuses.every(s => s === 'UP')) {
        service.status = 'Operational';
      } else if (serviceStatuses.some(s => s === 'UP')) {
        service.status = 'Degraded';
      }
    });

    res.render('admin/status', {
      status,
    });
  });
}

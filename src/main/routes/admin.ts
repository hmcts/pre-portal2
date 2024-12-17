import { Application } from 'express';
import { PreClient } from '../services/pre-api/pre-client';

import { SystemStatus } from '../services/system-status/system-status';

export default function (app: Application): void {
  app.get('/admin/status', async (req, res) => {
    const client = new PreClient();

    const systemStatus = new SystemStatus(client, app);

    const status = await systemStatus.getStatus();

    Object.values(status).forEach(service => {
      const serviceStatuses = Object.values(service.components);

      if (serviceStatuses.every(s => s === 'UP')) {
        service.status = 'OPERATIONAL';
      } else if (serviceStatuses.some(s => s === 'UP')) {
        service.status = 'DEGRADED';
      }
    });

    res.render('admin/status', {
      status,
    });
  });
}

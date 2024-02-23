import { Logger } from '@hmcts/nodejs-logging';
import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  private logger = Logger.getLogger('properties-volume');
  enableFor(server: Application): void {
    require('dotenv').config();
    set(config, 'session.redis.key', process.env.REDIS_ACCESS_KEY);
    set(config, 'ams.flowKey', process.env.AMS_FLOW_KEY);
    set(config, 'ams.flowUrl', process.env.AMS_FLOW_URL);
    set(config, 'b2c.appClientSecret', process.env.B2C_APP_CLIENT_SECRET);
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);
      this.setSecret('secrets.pre-hmctskv.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      this.setSecret('secrets.pre-hmctskv.redis6-access-key', 'session.redis.key');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-primary-key', 'pre.apiKey.primary');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-secondary-key', 'pre.apiKey.secondary');
      this.setSecret('secrets.pre-hmctskv.pp-authorization', 'ams.flowKey');
      this.setSecret('secrets.pre-hmctskv.ams-flow-url', 'ams.flowUrl');
      this.setSecret('secrets.pre-hmctskv.redis-access-key', 'b2c.appClientSecret');
    }
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}

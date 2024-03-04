import { Logger } from '@hmcts/nodejs-logging';
import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  private logger = Logger.getLogger('properties-volume');
  enableFor(server: Application): void {
    if (server.locals.ENV === 'production') {
      this.logger.info('Loading properties from mounted KV');
      propertiesVolume.addTo(config);
      this.setSecret('secrets.pre-hmctskv.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      this.setSecret('secrets.pre-hmctskv.redis6-access-key', 'session.redis.key');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-primary-key', 'pre.apiKey.primary');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-secondary-key', 'pre.apiKey.secondary');
      this.setSecret('secrets.pre-hmctskv.pp-authorization', 'ams.flowKey');
      this.setSecret('secrets.pre-hmctskv.ams-flow-url', 'ams.flowUrl');
    } else {
      this.logger.info('Loading properties from .env file');
      require('dotenv').config();
      set(config, 'ams.flowKey', process.env.AMS_FLOW_KEY || 'ams.flowKey');
      set(config, 'ams.flowUrl', process.env.AMS_FLOW_URL || 'ams.flowUrl');
      set(config, 'pre.apiUrl', process.env.PRE_API_URL || 'https://localhost:4550');
      set(config, 'pre.apiKey.primary', process.env.PRE_API_KEY_PRIMARY || 'pre.apiKey.primary');
    }
    this.logger.info('pre.apiUrl', config.get('pre.apiUrl'));
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}

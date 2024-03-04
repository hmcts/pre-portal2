import { Logger } from '@hmcts/nodejs-logging';
import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  private logger = Logger.getLogger('properties-volume');
  enableFor(server: Application): void {
    require('dotenv').config();
    set(config, 'session.redis.key', process.env.REDIS_ACCESS_KEY ?? '0');
    set(config, 'ams.flowKey', process.env.PP_AUTHORIZATION);
    set(config, 'ams.flowUrl', process.env.AMS_FLOW_URL ?? '1');
    set(config, 'pre.apiKey.primary', process.env.PRE_API_KEY_PRIMARY ?? '2');
    set(config, 'appInsights.instrumentationKey', process.env.APP_INSIGHTS_INSTRUMENTATION_KEY ?? '3');
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config, { failOnError: true });
      this.setSecret('secrets.pre-hmctskv.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      this.setSecret('secrets.pre-hmctskv.redis6-access-key', 'session.redis.key');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-primary-key', 'pre.apiKey.primary');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-secondary-key', 'pre.apiKey.secondary');
      this.setSecret('secrets.pre-hmctskv.pp-authorization', 'ams.flowKey');
      this.setSecret('secrets.pre-hmctskv.ams-flow-url', 'ams.flowUrl');
    }
    this.logger.info('==============================================');
    this.logger.info('ams.flowUrl', config.get('ams.flowUrl'));
    this.logger.info('session.redis.key', config.get('session.redis.key'));
    this.logger.info('pre.apiKey.primary', config.get('pre.apiKey.primary'));
    this.logger.info('appInsights.instrumentationKey', config.get('appInsights.instrumentationKey'));
    this.logger.info('server.locals.ENV', server.locals.ENV);
    this.logger.info('==============================================');
    process.exit();
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}

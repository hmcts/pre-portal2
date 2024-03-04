import { Logger } from '@hmcts/nodejs-logging';
import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  private logger = Logger.getLogger('properties-volume');

  enableFor(server: Application): void {
    set(config, 'pre.portalUrl', process.env.PORTAL_URL || 'https://localhost:4550');
    set(config, 'pre.apiUrl', process.env.API_URL || 'https://localhost:4551');
    set(config, 'session.secret', process.env.SESSION_SECRET || 'superlongrandomstringthatshouldbebetterinprod');

    if (server.locals.ENV === 'production') {
      this.logger.info('Loading properties from mounted KV');
      propertiesVolume.addTo(config);
      this.setSecret('secrets.pre-hmctskv.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      this.setSecret('secrets.pre-hmctskv.redis6-access-key', 'session.redis.key');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-primary-key', 'pre.apiKey.primary');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-primary-key', 'pre.primaryApiKey');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-secondary-key', 'pre.apiKey.secondary');
      this.setSecret('secrets.pre-hmctskv.pp-authorization', 'ams.flowKey');
      this.setSecret('secrets.pre-hmctskv.ams-flow-url', 'ams.flowUrl');
      this.setSecret('secrets.pre-hmctskv.pre-portal-sso', 'b2c.appClientSecret');
      this.setSecret('secrets.pre-hmctskv.b2c-test-login-email', 'b2c.testLogin.email');
      this.setSecret('secrets.pre-hmctskv.b2c-test-login-password', 'b2c.testLogin.password');
    } else {
      this.logger.info('Loading properties from .env file');
      require('dotenv').config();
      set(
        config,
        'appInsights.instrumentationKey',
        process.env.APPINSIGHTS_INSTRUMENTATIONKEY ?? 'appInsights.instrumentationKey'
      );
      set(config, 'pre.apiKey.primary', process.env.APIM_SUB_PORTAL_PRIMARY_KEY || 'pre.apiKey.primary');
      set(config, 'pre.primaryApiKey', process.env.APIM_SUB_PORTAL_PRIMARY_KEY || 'pre.primaryApiKey');
      set(config, 'pre.apiKey.secondary', process.env.APIM_SUB_PORTAL_SECONDARY_KEY || 'pre.apiKey.secondary');
      set(config, 'ams.flowKey', process.env.PP_AUTHORIZATION);
      set(config, 'ams.flowUrl', process.env.AMS_FLOW_URL);
      set(config, 'b2c.appClientSecret', process.env.B2C_APP_CLIENT_SECRET || 'b2c.appClientSecret');
      set(config, 'b2c.testLogin.email', process.env.B2C_TEST_LOGIN_EMAIL);
      set(config, 'b2c.testLogin.password', process.env.B2C_TEST_LOGIN_PASSWORD);
    }
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}

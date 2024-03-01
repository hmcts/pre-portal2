import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  enableFor(server: Application): void {
    require('dotenv').config();
    set(config, 'session.redis.key', process.env.REDIS_ACCESS_KEY);
    set(config, 'b2c.appClientSecret', process.env.B2C_APP_CLIENT_SECRET || 'b2c.appClientSecret');
    set(config, 'b2c.testLogin.email', process.env.B2C_TEST_LOGIN_EMAIL);
    set(config, 'b2c.testLogin.password', process.env.B2C_TEST_LOGIN_PASSWORD);
    set(config, 'pre.portalUrl', process.env.PORTAL_URL || 'https://localhost:4550');
    set(config, 'pre.apiUrl', process.env.API_URL || 'https://localhost:4551');
    set(config, 'pre.apiKey.primary', process.env.APIM_SUB_PORTAL_PRIMARY_KEY || '123');
    set(config, 'pre.apiKey.secondary', process.env.APIM_SUB_PORTAL_SECONDARY_KEY || '456');
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);
      this.setSecret('secrets.pre-hmctskv.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      this.setSecret('secrets.pre-hmctskv.redis6-access-key', 'session.redis.key');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-primary-key', 'pre.apiKey.primary');
      this.setSecret('secrets.pre-hmctskv.apim-sub-portal-secondary-key', 'pre.apiKey.secondary');
      this.setSecret('secrets.pre-hmctskv.pre-portal-sso', 'b2c.appClientSecret');
      this.setSecret('secrets.pre-hmctskv.b2c-test-login-email', 'b2c.testLogin.email');
      this.setSecret('secrets.pre-hmctskv.b2c-test-login-password', 'b2c.testLogin.password');
    }
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}

import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import RedisStore from 'connect-redis';
import { Application } from 'express';
import { ConfigParams, auth } from 'express-openid-connect';
import session from 'express-session';
import * as redis from 'redis';
import FileStoreFactory from 'session-file-store';

const FileStore = FileStoreFactory(session);

export class Auth {
  public enableFor(app: Application): void {
    const logger = Logger.getLogger('auth-module');

    // https://auth0.github.io/express-openid-connect/interfaces/ConfigParams.html
    app.use(auth(this.getConfigParams(app, logger)));
  }

  private getConfigParams(app: Application, logger: Logger): ConfigParams {
    const authConfig = {
      authRequired: true,
      attemptSilentLogin: true,
      idpLogout: true,
      secret: config.get('session.secret') as string,
      baseURL: config.get('pre.portalUrl') as string,
      clientID: config.get('b2c.appClientId') as string,
      issuerBaseURL: config.get('b2c.baseUrl') as string,
      clientAuthMethod: 'client_secret_post',
      clientSecret: config.get('b2c.appClientSecret') as string,
      authorizationParams: {
        response_type: 'id_token',
        scope: 'openid email profile',
      },
      session: {
        name: 'preportal-session',
        rollingDuration: config.get('session.maxAge') as number,
        cookie: {
          httpOnly: true,
          sameSite: 'Lax', // required for the oauth2 redirect
          secure: true,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getSessionStore(app, logger) as any, // https://github.com/auth0/express-openid-connect/issues/234
      },
    };

    return authConfig;
  }

  private getSessionStore(app: Application, logger: Logger) {
    const redisHost = config.get('session.redis.host');
    if (redisHost) {
      const client = redis.createClient({
        socket: {
          host: redisHost as string,
          port: 6380,
          connectTimeout: 15000,
          tls: true,
        },
        password: config.get('session.redis.key') as string,
      });

      client.connect().catch(logger.error);

      app.locals.redisClient = client;
      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}

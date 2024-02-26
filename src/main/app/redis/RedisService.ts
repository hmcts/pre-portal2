import { Logger } from '@hmcts/nodejs-logging';
import * as redis from 'redis';


export class RedisService {
  public getClient(host: string, key: string, logger: Logger): unknown {
    const client = redis.createClient({
      socket: {
        host,
        port: 6380,
        connectTimeout: 15000,
        tls: true,
      },
      password: key,
    });

    client.connect().catch(logger.error);
    return client;
  }
}

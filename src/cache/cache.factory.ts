import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import fs from 'fs';
import ini from 'ini';
import os from 'os';
import path from 'path';

/**
 * Singleton cache for AWS SDK config
 */
export class CacheFactory {
  private static _instance: CacheFactory;

  readonly aws = {
    region: 'us-east-1',
    accountId: null,
  };

  private constructor() {}

  static async getInstance(): Promise<CacheFactory> {
    if (!this._instance) {
      this._instance = new CacheFactory();
    }

    await this._instance.init();
    return this._instance;
  }

  private async init() {
    this.readAwsConfig();
    await this.fetchAndSetAwsAccountId();
  }

  private readAwsConfig() {
    const configFile = fs.readFileSync(path.join(os.homedir(), '.aws', 'config'), 'utf-8');
    const config = ini.parse(configFile);
    const awsRegion = config['default'] ? config['default']['region'] : 'us-east-1';

    // Log the region or handle the case where it's not found
    if (awsRegion) {
      this.aws.region = awsRegion;
    }
  }

  private async fetchAndSetAwsAccountId() {
    try {
      const client = new STSClient({ region: this.aws.region });
      const command = new GetCallerIdentityCommand({});
      const response = await client.send(command);
      this.aws.accountId = response.Account;
    } catch (err: any) {
      console.error('error retrieving aws account id');
      console.error(err.message);
    }
  }
}

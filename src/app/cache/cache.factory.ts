import { CloudFormationClient } from '@aws-sdk/client-cloudformation';
import { EC2Client } from '@aws-sdk/client-ec2';
import { ECSClient } from '@aws-sdk/client-ecs';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import fs from 'fs';
import ini from 'ini';
import os from 'os';
import path from 'path';
import { AwsCache } from './cache.interface';

/**
 * Singleton cache for AWS SDK config
 */
export class CacheFactory {
  private static _instance: CacheFactory;

  readonly aws: AwsCache = {
    region: 'us-east-1',
    accountId: null,
    clients: {
      cfn: null,
      ecs: null,
      ec2: null,
      sts: null,
    },
  };

  private constructor() {}

  static getInstance(): CacheFactory {
    if (!this._instance) {
      this._instance = new CacheFactory();
    }

    return this._instance;
  }

  /** initializes the cache. call only once, immediately at start-up */
  async init(): Promise<void> {
    const configFile = fs.readFileSync(path.join(os.homedir(), '.aws', 'config'), 'utf-8');
    const config = ini.parse(configFile);
    const awsRegion = config['default'] ? config['default']['region'] : 'us-east-1';
    this.aws.region = awsRegion;

    this.aws.clients.sts = new STSClient({ region: this.aws.region });
    return this.aws.clients.sts
      .send(new GetCallerIdentityCommand({}))
      .then((res) => {
        this.aws.accountId = res.Account;
        this.aws.clients.cfn = new CloudFormationClient({ region: this.aws.region });
        this.aws.clients.ecs = new ECSClient({ region: this.aws.region });
        this.aws.clients.ec2 = new EC2Client({ region: this.aws.region });
        this.aws.clients.sts = new STSClient({ region: this.aws.region });
      })
      .catch((err) => {
        console.error('error fetching aws account id');
        console.error(err.message);
      });
  }
}

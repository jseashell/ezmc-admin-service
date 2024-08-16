import { CloudFormationClient } from '@aws-sdk/client-cloudformation';
import { EC2Client } from '@aws-sdk/client-ec2';
import { ECSClient } from '@aws-sdk/client-ecs';
import { STSClient } from '@aws-sdk/client-sts';

export interface AwsCache {
  region: string;
  accountId: string | null;
  clients: {
    cfn: CloudFormationClient;
    ecs: ECSClient;
    ec2: EC2Client;
    sts: STSClient;
  };
}

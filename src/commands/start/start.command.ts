import { CloudFormationClient, UpdateStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { stackName } from '@utils';

export async function start(serverName: string) {
  const cache = await CacheFactory.getInstance();
  const client = new CloudFormationClient({ region: cache.aws.region });

  try {
    await client.send(
      new UpdateStackCommand({
        StackName: stackName(serverName),
        UsePreviousTemplate: true,
        Parameters: [
          {
            ParameterKey: 'ServerState',
            ParameterValue: 'Running',
          },
        ],
        Capabilities: ['CAPABILITY_NAMED_IAM'],
      }),
    );
  } catch (error: any) {
    console.error(`${serverName} failed to start.`, error.message);
  }
}

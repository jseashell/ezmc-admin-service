import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { stackName } from '@utils';
import { status } from '../status/status.command';
import { stop } from '../stop/stop.command';

export async function remove(serverName: string): Promise<void> {
  status(serverName)
    .then((status) => {
      if (status == 'running') {
        return stop(serverName);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => CacheFactory.getInstance())
    .then((cache) => {
      return new CloudFormationClient({ region: cache.aws.region }).send(
        new DeleteStackCommand({
          StackName: stackName(serverName),
        }),
      );
    });
}

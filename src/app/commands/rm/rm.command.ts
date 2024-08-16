import { DeleteStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { status, stop } from '@commands';
import { stackName } from '@utils';

export async function rm(serverName: string): Promise<void> {
  status(serverName)
    .then((status) => {
      if (status == 'running') {
        return stop(serverName);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      return CacheFactory.getInstance().aws.clients.cfn.send(
        new DeleteStackCommand({
          StackName: stackName(serverName),
        }),
      );
    });
}

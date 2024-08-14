import { ECSClient, ListTasksCommand, StopTaskCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { clusterName } from '@utils';

export async function stop(serverName: string) {
  const cluster = clusterName(serverName);
  const cache = await CacheFactory.getInstance();
  const client = new ECSClient({ region: cache.aws.region });

  try {
    const res = await client.send(new ListTasksCommand({ cluster: cluster }));
    if (res.taskArns.length === 0) {
      console.log('the server is already stopped');
      return;
    }

    await client.send(new StopTaskCommand({ cluster: cluster, task: res.taskArns[0] }));
  } catch (error: any) {
    console.error(`${serverName} failed to stop.`, error.message);
  }
}

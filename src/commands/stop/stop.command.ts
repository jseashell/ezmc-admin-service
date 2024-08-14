import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { clusterName, serviceName } from '@utils';

export async function stop(serverName: string) {
  const cache = await CacheFactory.getInstance();
  const client = new ECSClient({ region: cache.aws.region });

  try {
    await client.send(
      new UpdateServiceCommand({
        cluster: clusterName(serverName),
        service: serviceName(serverName),
        desiredCount: 0,
      }),
    );
  } catch (error: any) {
    console.error(`${serverName} failed to stop.`, error.message);
  }
}

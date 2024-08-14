import { CreateServiceCommand, ECSClient } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { clusterName, serviceName, stackExists } from '@utils';

export async function start(serverName: string) {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return;
  }

  // TODO create task?

  const cache = await CacheFactory.getInstance();
  new ECSClient({ region: cache.aws.region }).send(
    new CreateServiceCommand({
      cluster: clusterName(serverName),
      serviceName: serviceName(serverName),
      desiredCount: 1,
      launchType: 'FARGATE',
    }),
  );
}

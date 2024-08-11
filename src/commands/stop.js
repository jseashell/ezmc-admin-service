import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { buildClusterArn, getServiceName } from '../libs/ecs.js';

export async function stop(clusterName) {
  const serviceName = await getServiceName(clusterName);

  return new ECSClient({ region: process.env.REGION }).send(
    new UpdateServiceCommand({
      cluster: buildClusterArn(clusterName),
      service: serviceName,
      desiredCount: 0,
    }),
  );
}

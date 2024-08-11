import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { buildClusterArn } from '../libs/ecs.js';

export async function start(serviceName, clusterName) {
  return new ECSClient({ region: process.env.REGION }).send(
    new UpdateServiceCommand({
      cluster: buildClusterArn(clusterName),
      service: serviceName,
      desiredCount: 1,
    }),
  );
}

import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { buildClusterArn } from '../utils/ecs.js';

export async function start(serviceName, serverName) {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  return new ECSClient({ region: region }).send(
    new UpdateServiceCommand({
      cluster: buildClusterArn(serverName),
      service: serviceName,
      desiredCount: 1,
    }),
  );
}

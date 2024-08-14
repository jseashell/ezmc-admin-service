import { CreateServiceCommand, ECSClient } from '@aws-sdk/client-ecs';
import { clusterName, serviceName, stackExists } from '@utils';

export async function start(serverName: string) {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return;
  }

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  // TODO create task?

  new ECSClient({ region: region }).send(
    new CreateServiceCommand({
      cluster: clusterName(serverName),
      serviceName: serviceName(serverName),
      desiredCount: 1,
      launchType: 'FARGATE',
    }),
  );
}

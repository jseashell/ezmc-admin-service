import { CloudFormationClient, DeleteStackCommand, DeletionMode } from '@aws-sdk/client-cloudformation';
import {
  DeleteServiceCommand,
  DescribeServicesCommand,
  ECSClient,
  PutClusterCapacityProvidersCommand,
} from '@aws-sdk/client-ecs';
import { clusterName, serviceName, sleep, stackName } from '@utils';

export async function remove(serverName: string) {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  await forceDeleteService(serverName)
    .then(async () => await sleep(5))
    .then(() => detachCapacityProviders(serverName))
    .then(async () => await sleep(5))
    .then(() => forceDeleteStack(serverName));

  console.log('success!');
}

/**
 * Use force to delete the service even if there are tasks still running
 */
async function forceDeleteService(serverName: string) {
  try {
    const client = new ECSClient({ region: process.env.AWS_REGION });

    const describeServiceCommand = new DescribeServicesCommand({
      cluster: clusterName(serverName),
      services: [serviceName(serverName)],
    });

    const describeResponse = await client.send(describeServiceCommand);
    const service = describeResponse.services?.[0];

    if (service && service.serviceArn) {
      const deleteServiceCommand = new DeleteServiceCommand({
        cluster: clusterName(serverName),
        service: serviceName(serverName),
        force: true,
      });

      await client.send(deleteServiceCommand);
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

async function detachCapacityProviders(serverName: string) {
  const client = new ECSClient({ region: process.env.AWS_REGION });
  await client.send(
    new PutClusterCapacityProvidersCommand({
      cluster: clusterName(serverName),
      capacityProviders: [], // none
      defaultCapacityProviderStrategy: undefined,
    }),
  );
}

async function forceDeleteStack(serverName: string) {
  return new CloudFormationClient({ region: process.env.AWS_REGION }).send(
    new DeleteStackCommand({
      StackName: stackName(serverName),
      DeletionMode: DeletionMode.FORCE_DELETE_STACK,
    }),
  );
}

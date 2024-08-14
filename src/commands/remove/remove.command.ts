import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';
import {
  DeleteServiceCommand,
  DescribeServicesCommand,
  ECSClient,
  PutClusterCapacityProvidersCommand,
} from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { clusterName, serviceName, sleep, stackName } from '@utils';

export async function remove(serverName: string) {
  await forceDeleteService(serverName)
    .then(async () => await sleep(5))
    .then(() => detachCapacityProviders(serverName))
    .then(async () => await sleep(5))
    .then(() => deleteStack(serverName));

  console.log('success!');
}

/**
 * Use force to delete the service even if there are tasks still running
 */
async function forceDeleteService(serverName: string) {
  try {
    const cache = await CacheFactory.getInstance();
    const client = new ECSClient({ region: cache.aws.region });

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
  const cache = await CacheFactory.getInstance();
  const client = new ECSClient({ region: cache.aws.region });
  await client.send(
    new PutClusterCapacityProvidersCommand({
      cluster: clusterName(serverName),
      capacityProviders: [], // none
      defaultCapacityProviderStrategy: undefined,
    }),
  );
}

async function deleteStack(serverName: string) {
  const cache = await CacheFactory.getInstance();
  return new CloudFormationClient({ region: cache.aws.region }).send(
    new DeleteStackCommand({
      StackName: stackName(serverName),
    }),
  );
}

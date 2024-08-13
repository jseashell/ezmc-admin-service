import { CloudFormationClient, DeleteStackCommand, DeletionMode } from '@aws-sdk/client-cloudformation';
import {
  DeleteServiceCommand,
  DescribeServicesCommand,
  ECSClient,
  PutClusterCapacityProvidersCommand,
} from '@aws-sdk/client-ecs';
import { stackName } from '../utils/cfn.js';
import { clusterName, serviceName } from '../utils/ecs.js';

export async function remove(serverName) {
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
async function forceDeleteService(serverName) {
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
  } catch (error) {
    console.error(error.message);
  }
}

async function detachCapacityProviders(serverName) {
  const client = new ECSClient({ region: process.env.AWS_REGION });
  await client.send(
    new PutClusterCapacityProvidersCommand({
      cluster: clusterName(serverName),
      capacityProviders: [], // none
    }),
  );
}

async function forceDeleteStack(serverName) {
  return new CloudFormationClient({ region: process.env.AWS_REGION }).send(
    new DeleteStackCommand({
      StackName: stackName(serverName),
      DeletionMode: DeletionMode.FORCE_DELETE_STACK,
    }),
  );
}

/**
 * sleeps the given number of seconds
 * @param {number} n
 * @returns async sleep
 */
const sleep = async (n) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, n * 1000);
  });
};

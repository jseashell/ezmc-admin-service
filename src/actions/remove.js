import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';
import {
  DeleteServiceCommand,
  DescribeServicesCommand,
  ECSClient,
  ListTasksCommand,
  PutClusterCapacityProvidersCommand,
  StopTaskCommand,
} from '@aws-sdk/client-ecs';
import { getServiceName } from '../utils/ecs.js';

export async function remove(serverName) {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const clusterName = 'ezmc-' + serverName + '-cluster';

  await deleteService(region)
    .then(() => detachCapacityProviders(clusterName, region))
    .then(() => deleteStack(serverName));

  console.log('success!');
}

async function deleteService(serverName, region) {
  try {
    // Step 1: List running tasks in the service
    const clusterName = 'ezmc-' + serverName + '-cluster';
    const serviceName = await getServiceName(clusterName);
    const listTasksCommand = new ListTasksCommand({
      cluster: clusterName,
      serviceName: serviceName,
    });

    const client = new ECSClient({ region: region });
    const tasksResponse = await client.send(listTasksCommand);
    const taskArns = tasksResponse.taskArns || [];

    if (taskArns.length === 0) {
      console.log(`No tasks found running in the service ${serviceName}.`);
    } else if (taskArns.length > 1) {
      throw new Error('More than one task found in the service, which is unexpected.');
    } else {
      const taskArn = taskArns[0];

      console.log(`Found task ${taskArn} running in the service.`);

      // Step 2: Stop the running task
      const stopTaskCommand = new StopTaskCommand({
        cluster: clusterName,
        task: taskArn,
        reason: 'Service is being deleted',
      });

      await client.send(stopTaskCommand);
      console.log(`Requested stop for task: ${taskArn}`);

      // Wait for the task to stop
      await waitForTaskToStop(taskArn);
    }

    // Step 3: Delete the service
    const describeServiceCommand = new DescribeServicesCommand({
      cluster: clusterName,
      services: [serviceName],
    });

    const describeResponse = await client.send(describeServiceCommand);
    const service = describeResponse.services?.[0];

    if (service && service.serviceArn) {
      const deleteServiceCommand = new DeleteServiceCommand({
        cluster: clusterName,
        service: serviceName,
        force: true, // Use force to delete the service even if there are tasks still running
      });

      await client.send(deleteServiceCommand);
      console.log(`Deleted service: ${serviceName}`);
    } else {
      console.log(`Service ${serviceName} not found.`);
    }
  } catch (error) {
    console.error('Error deleting service:', error);
  }
}

async function detachCapacityProviders(clusterName, region) {
  const client = new ECSClient({ region: region });
  await client.send(
    new PutClusterCapacityProvidersCommand({
      cluster: clusterName,
      capacityProviders: [], // none
    }),
  );
}

async function deleteStack(serverName) {
  return new CloudFormationClient({ region: region }).send(
    new DeleteStackCommand({
      StackName: 'ezmc-' + serverName,
    }),
  );
}

import { DescribeTasksCommand, ECSClient, ListTasksCommand, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { stackExists } from '../utils/cfn';
import { clusterArn, clusterName, serviceArn, serviceName } from '../utils/ecs';

export async function stop(serverName: string) {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return;
  }

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const client = new ECSClient({ region: region });

  client.send(
    new UpdateServiceCommand({
      cluster: clusterArn(serverName),
      service: serviceName(serverName),
      desiredCount: 0,
    }),
  );

  await waitForTaskToStop(serverName);
}

const waitForTaskToStop = async (serverName: string) => {
  console.log(`waiting for ${serverName} to stop`);
  const client = new ECSClient({ region: process.env.AWS_REGION });

  const serviceName = await serviceArn(serverName);
  const taskArn = await client
    .send(new ListTasksCommand({ cluster: clusterArn(serverName), serviceName: serviceName }))
    .then((res) => res?.taskArns?.[0] || '');

  if (taskArn) {
    let i = 0;
    while (true) {
      const tasksResponse = await client.send(
        new DescribeTasksCommand({ cluster: clusterName(serverName), tasks: [taskArn] }),
      );
      const task = tasksResponse.tasks?.[0];

      if (task && task.lastStatus === 'STOPPED') {
        break;
      }

      console.log(`still waiting${new Array(i % 3).fill('.')}`);
      i++;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  console.log(`${serverName} stopped`);
};

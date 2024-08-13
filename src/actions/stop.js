import { DescribeTasksCommand, ECSClient, ListTasksCommand, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { stackExists } from '../utils/cfn.js';
import { clusterArn } from '../utils/ecs.js';

export async function stop(serverName) {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return;
  }

  const serviceName = 'ezmc-' + serverName + '-ecs-service';

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  await new ECSClient({ region: region }).send(
    new UpdateServiceCommand({
      cluster: clusterArn(serverName),
      service: serviceName,
      desiredCount: 0,
    }),
  );

  await waitForTaskToStop(serverName);
}

const waitForTaskToStop = async (serverName) => {
  console.log(`waiting for ${serverName} to stop`);

  const serviceArn = await serviceArn(serverName);
  const taskArn = await new ECSClient({ region: process.env.AWS_REGION })
    .send(
      new ListTasksCommand({
        cluster: clusterArn(serverName),
        serviceName: serviceArn,
      }),
    )
    .then((res) => {
      if (res.taskArns?.length > 0) {
        return res.taskArns[0];
      } else {
        return '';
      }
    });

  if (taskArn) {
    const i = 0;
    while (true) {
      const describeTasksCommand = new DescribeTasksCommand({
        cluster: CLUSTER_NAME,
        tasks: [taskArn],
      });

      const tasksResponse = await new ECSClient({ region: process.env.AWS_REGION }).send(describeTasksCommand);
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

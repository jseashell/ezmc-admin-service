import { DescribeTasksCommand, ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';
import { stackExists } from '../utils/cfn.js';
import { clusterArn, serviceArn } from '../utils/ecs.js';

export async function status(serverName) {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return;
  }

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const client = new ECSClient({ region: region });
  let tasks = await client.send(
    new ListTasksCommand({
      cluster: clusterArn(serverName),
      serviceName: serviceArn(serverName),
    }),
  );

  let taskArn;
  if (tasks?.taskArns?.length > 0) {
    taskArn = tasks.taskArns[0];
  } else {
    return 'STOPPED';
  }

  try {
    tasks = await client.send(
      new DescribeTasksCommand({
        cluster: clusterArn(serverName),
        tasks: [taskArn],
      }),
    );

    if (res.tasks?.length > 0 && res.tasks[0].containers?.length > 0) {
      return res.tasks[0].containers[0].lastStatus;
    } else {
      return 'LAUNCHING';
    }
  } catch (err) {
    return 'STOPPED';
  }
}

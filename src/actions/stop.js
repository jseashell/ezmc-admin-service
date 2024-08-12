import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { buildClusterArn, getServiceName } from '../utils/ecs.js';

export async function stop(serverName) {
  const serviceName = await getServiceName(serverName);

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  await new ECSClient({ region: region }).send(
    new UpdateServiceCommand({
      cluster: buildClusterArn(serverName),
      service: serviceName,
      desiredCount: 0,
    }),
  );

  // await waitForTaskToStop()
}

const waitForTaskToStop = async (taskArn, region) => {
  const i = 0;
  while (true) {
    const describeTasksCommand = new DescribeTasksCommand({
      cluster: CLUSTER_NAME,
      tasks: [taskArn],
    });

    const tasksResponse = await new ECSClient({ region: region }).send(describeTasksCommand);
    const task = tasksResponse.tasks?.[0];

    if (task && task.lastStatus === 'STOPPED') {
      console.log(`Task ${taskArn} has stopped.`);
      break;
    }

    console.log(`Still waiting${new Array(i % 3).fill('.')}`);
    i++;
    await new Promise((res) => setTimeout(res, 3000));
  }
};

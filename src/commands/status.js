import { DescribeTasksCommand, ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';
import { buildClusterArn, getServiceArn } from '../utils/ecs.js';

export async function status(serverName) {
  const serviceArn = await getServiceArn(serverName);

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const client = new ECSClient({ region: region });
  return client
    .send(
      new ListTasksCommand({
        cluster: buildClusterArn(serverName),
        serviceName: serviceArn,
      }),
    )
    .then((res) => {
      if (res.taskArns?.length > 0) {
        return res.taskArns[0];
      } else {
        return Promise.reject(`No tasks for service "${serviceArn}" in "${serverName}"`);
      }
    })
    .then((taskArn) => {
      return client.send(
        new DescribeTasksCommand({
          cluster: buildClusterArn(serverName),
          tasks: [taskArn],
        }),
      );
    })
    .then((res) => {
      if (res.tasks?.length > 0 && res.tasks[0].containers?.length > 0) {
        return res.tasks[0].containers[0].lastStatus;
      } else {
        return 'LAUNCHING';
      }
    })
    .catch(() => {
      return 'STOPPED';
    });
}

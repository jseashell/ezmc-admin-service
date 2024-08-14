import { DescribeTasksCommand, ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';
import { stackExists } from '../utils/cfn';
import { clusterArn, serviceName } from '../utils/ecs';

export async function status(serverName: string) {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return;
  }

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const client = new ECSClient({ region: region });

  const res = await client.send(
    new ListTasksCommand({ cluster: clusterArn(serverName), serviceName: serviceName(serverName) }),
  );

  if (res?.taskArns?.length == 0) {
    return 'STOPPED';
  }

  const taskArn = res?.taskArns?.[0] || '';

  try {
    const res = await client.send(
      new DescribeTasksCommand({
        cluster: clusterArn(serverName),
        tasks: [taskArn],
      }),
    );

    return res?.tasks?.[0]?.lastStatus || 'LAUNCHING';
  } catch (err) {
    return 'STOPPED';
  }
}

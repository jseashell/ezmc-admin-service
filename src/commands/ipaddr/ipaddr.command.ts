import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { DescribeContainerInstancesCommand, ECSClient, ListContainerInstancesCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { clusterArn, stackExists } from '@utils';

export async function ipAddress(serverName: string): Promise<string> {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return '';
  }

  const cache = await CacheFactory.getInstance();
  const region = cache.aws.region;
  const cluster = await clusterArn(serverName);
  const ecsClient = new ECSClient({ region: region });
  return ecsClient
    .send(
      new ListContainerInstancesCommand({
        cluster: cluster,
      }),
    )
    .then((res) => {
      if (res?.containerInstanceArns?.[0]) {
        return res.containerInstanceArns[0];
      } else {
        return Promise.reject(`No container instances for "${serverName}"`);
      }
    })
    .then(async (containerInstanceArn) => {
      const cluster = await clusterArn(serverName);
      return ecsClient.send(
        new DescribeContainerInstancesCommand({
          cluster: cluster,
          containerInstances: [containerInstanceArn],
        }),
      );
    })
    .then((res) => {
      if (res.containerInstances?.[0]) {
        return res.containerInstances[0];
      } else {
        return Promise.reject('Unable to describe a container instance');
      }
    })
    .then(async (containerInstance) => {
      const instanceId = containerInstance.ec2InstanceId || '';

      const cache = await CacheFactory.getInstance();
      const ec2Client = new EC2Client({ region: cache.aws.region });
      return ec2Client.send(
        new DescribeInstancesCommand({
          Filters: [
            {
              Name: 'instance-id',
              Values: [instanceId],
            },
          ],
        }),
      );
    })
    .then((res) => {
      return res.Reservations?.[0].Instances?.[0].PublicIpAddress || '';
    })
    .catch((err) => {
      console.error(err);
      return '';
    });
}

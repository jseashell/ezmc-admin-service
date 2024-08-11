import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { DescribeContainerInstancesCommand, ECSClient, ListContainerInstancesCommand } from '@aws-sdk/client-ecs';
import { buildClusterArn } from '../libs/ecs.js';

export async function ipAddress(clusterName) {
  const ecsClient = new ECSClient({ region: process.env.REGION });
  return ecsClient
    .send(
      new ListContainerInstancesCommand({
        cluster: buildClusterArn(clusterName),
      }),
    )
    .then((res) => {
      if (res.containerInstanceArns?.length > 0) {
        return res.containerInstanceArns[0];
      } else {
        return Promise.reject(`No container instances in cluster "${clusterName}"`);
      }
    })
    .then((containerInstanceArn) => {
      return ecsClient.send(
        new DescribeContainerInstancesCommand({
          cluster: buildClusterArn(clusterName),
          containerInstances: [containerInstanceArn],
        }),
      );
    })
    .then((res) => {
      if (res.containerInstances?.length > 0) {
        return res.containerInstances[0];
      } else {
        return Promise.reject('Unable to describe a container instance');
      }
    })
    .then((containerInstance) => {
      const instanceId = containerInstance.ec2InstanceId;
      const ec2Client = new EC2Client({ region: process.env.REGION });
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
      return res.Reservations?.[0].Instances?.[0].PublicIpAddress;
    })
    .catch((err) => {
      console.error(err);
      return '';
    });
}

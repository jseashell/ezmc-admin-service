import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { DescribeContainerInstancesCommand, ECSClient, ListContainerInstancesCommand } from '@aws-sdk/client-ecs';
import { stackExists } from '../utils/cfn.js';
import { clusterArn } from '../utils/ecs.js';

export async function ipAddress(serverName) {
  if (!stackExists(serverName)) {
    console.log(`${serverName} does not exist`);
    return;
  }

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const ecsClient = new ECSClient({ region: region });
  return ecsClient
    .send(
      new ListContainerInstancesCommand({
        cluster: clusterArn(serverName),
      }),
    )
    .then((res) => {
      if (res.containerInstanceArns?.length > 0) {
        return res.containerInstanceArns[0];
      } else {
        return Promise.reject(`No container instances for "${serverName}"`);
      }
    })
    .then((containerInstanceArn) => {
      return ecsClient.send(
        new DescribeContainerInstancesCommand({
          cluster: clusterArn(serverName),
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
      const ec2Client = new EC2Client({ region: process.env.AWS_REGION });
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

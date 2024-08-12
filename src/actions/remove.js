import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';
import { ECSClient, PutClusterCapacityProvidersCommand } from '@aws-sdk/client-ecs';

export async function remove(serverName) {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  // Example usage
  const clusterName = 'ezmc-' + serverName + '-cluster';

  await detachCapacityProviders(clusterName, region);

  await new CloudFormationClient({ region: region }).send(
    new DeleteStackCommand({
      StackName: 'ezmc-' + serverName,
    }),
  );

  console.log('success!');
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

import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';

export async function remove(serverName) {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  // Example usage
  const clusterName = 'ezmc-' + serverName + '-cluster';
  const capacityProviderToDetach = 'your-capacity-provider'; // Replace with the actual capacity provider name

  await detachCapacityProvider(clusterName, capacityProviderToDetach);
  console.log(`detached capacity provider ${capacityProviderToDetach} from cluster ${clusterName}`);

  await new CloudFormationClient({ region: region }).send(
    new DeleteStackCommand({
      StackName: 'ezmc-' + serverName,
    }),
  );

  console.log('deleting cfn stack');
}

const { ECSClient, PutClusterCapacityProvidersCommand, DescribeClustersCommand } = require('@aws-sdk/client-ecs');

async function detachCapacityProvider(clusterName, capacityProviderToDetach) {
  const client = new ECSClient({ region: process.env.REGION });
  await client.send(
    new PutClusterCapacityProvidersCommand({
      cluster: clusterName,
      capacityProviders: [], // none
    }),
  );
}

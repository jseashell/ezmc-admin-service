import { CloudFormationClient, Parameter, UpdateStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { stackName } from '@utils';
import { ParamsKey } from './params.enum';

export async function setParams(serverName: string, params: Parameter[]): Promise<void> {
  validateOrThrow(params);

  const cache = await CacheFactory.getInstance();
  const client = new CloudFormationClient({ region: cache.aws.region });
  await client.send(
    new UpdateStackCommand({
      StackName: stackName(serverName),
      Parameters: params,
    }),
  );
}

function validateOrThrow(params: Parameter[]): void {
  for (let param of params) {
    if (!Object.values(ParamsKey).find((k) => k == param.ParameterKey)) {
      throw new Error('invalid parametes');
    }
  }
}

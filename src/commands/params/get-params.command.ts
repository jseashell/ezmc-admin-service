import { Parameter } from '@aws-sdk/client-cloudformation';
import { stack } from '@utils';

export async function getParams(serverName: string): Promise<Parameter[]> {
  return stack(serverName)
    .then((stack) => stack.Parameters)
    .catch((err) => {
      console.error(err.message);
      return [];
    });
}

import { stack } from '@utils';
import { ParamsKey } from './params.enum';

export async function getParams(serverName: string): Promise<void> {
  await stack(serverName)
    .then((stack) =>
      stack.Parameters.filter((p) => Object.values(ParamsKey).find((key) => key == p.ParameterKey))
        .sort((a, b) => a.ParameterKey.localeCompare(b.ParameterKey))
        .reduce((acc, { ParameterKey, ParameterValue }) => {
          acc[ParameterKey] = ParameterValue;
          return acc;
        }, {}),
    )
    .then((params) => console.table(params))
    .catch((err) => {
      console.error(err.message);
    });
}

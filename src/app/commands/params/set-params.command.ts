import { Parameter, UpdateStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { stackName } from '@utils';
import { ParamsKey } from './params.enum';

export async function setParams(serverName: string, options: Record<string, any>): Promise<void> {
  const params = parse(options);
  await CacheFactory.getInstance().aws.clients.cfn.send(
    new UpdateStackCommand({
      StackName: stackName(serverName),
      Parameters: params,
    }),
  );
}

export function parse(options: Record<string, any>): Parameter[] {
  const params: Parameter[] = [];
  const discard = {};

  if (/^([a-zA-Z0-9_]+)(,[a-zA-Z0-9_]+)*$/.exec(options.admins)) {
    params.push({
      ParameterKey: ParamsKey.ADMINS,
      ParameterValue: options.admins,
    });
  } else if (options.admins) {
    discard['-a, --admins'] = 'invalid name format for one or more admins';
  }

  if (/^(?:peaceful|easy|normal|hard)$/.exec(options.difficulty)) {
    params.push({
      ParameterKey: ParamsKey.DIFFICULTY,
      ParameterValue: options.difficulty,
    });
  } else if (options.difficulty) {
    discard['-d, --difficulty'] = 'valid values are [peaceful|easy|normal|hard]';
  }

  if (/^(?:creative|survival|adventure|spectator)$/.exec(options.gamemode)) {
    params.push({
      ParameterKey: ParamsKey.GAMEMODE,
      ParameterValue: options.gamemode,
    });
  } else if (options.gamemode) {
    discard['-g, --gamemode'] = 'valid values are [creative|survival|adventure|spectator]';
  }

  if (/[1|2|4|8|16]G/.exec(options.mem)) {
    params.push({
      ParameterKey: ParamsKey.MEMORY,
      ParameterValue: options.mem,
    });
  } else if (options.mem) {
    discard['-m, --mem'] = 'valid values are [1G|2G|4G|8G|16G]';
  }

  if (options.playermax && Number(options.playermax) > 0 && Number(options.playermax) <= 100) {
    params.push({
      ParameterKey: ParamsKey.PLAYERS_MAX,
      ParameterValue: options.playermax,
    });
  } else if (options.playermax) {
    discard['-p, --playermax'] = 'must be 1 - 100';
  }

  if (/^(?:running|stopped)$/.exec(options.state)) {
    params.push({
      ParameterKey: ParamsKey.SERVER_STATE,
      ParameterValue: options.state,
    });
  } else if (options.state) {
    discard['-s, --state'] = 'valid values are [running|stopped]';
  }

  if (options.viewdist && Number(options.viewdist) > 0 && Number(options.viewdist) <= 20) {
    params.push({
      ParameterKey: ParamsKey.VIEW_DIST,
      ParameterValue: options.viewdist,
    });
  } else if (options.viewdist) {
    discard['-v, --viewdist'] = 'must be 1 - 20';
  }

  if (/^([a-zA-Z0-9_]+)(,[a-zA-Z0-9_]+)*$/.exec(options.whitelist)) {
    params.push({
      ParameterKey: ParamsKey.WHITELIST,
      ParameterValue: options.whitelist,
    });
  } else if (options.whitelist) {
    discard['-w, --whitelist'] = 'invalid name format for one or more whitelisted players';
  }

  if (options.timezone) {
    params.push({
      ParameterKey: ParamsKey.TIMEZONE,
      ParameterValue: options.timezone,
    });
  }

  if (Object.keys(discard).length > 0) {
    console.log('discarded invalid parameters');
    console.table(discard);
  }

  console.table(
    params.reduce((acc, { ParameterKey, ParameterValue }) => {
      acc[ParameterKey] = ParameterValue;
      return acc;
    }, {}),
  );

  return params;
}

import { Capability, Parameter, UpdateStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { stackName } from '@utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ParamsKey } from './params.enum';

export async function setParams(serverName: string, options: Record<string, any>): Promise<void> {
  const { params, discard } = convertTo(options);

  if (params.length > 0) {
    console.table(
      params.reduce((acc, { ParameterKey, ParameterValue }) => {
        acc[ParameterKey] = ParameterValue;
        return acc;
      }, {}),
    );
  }

  if (discard.length > 0) {
    console.log(' *discarded invalid params: ' + discard.join(', '));
  }

  const path = resolve('./src/app/commands/new/templates/default.yml');
  const templateBody = readFileSync(path).toString();

  await CacheFactory.getInstance().aws.clients.cfn.send(
    new UpdateStackCommand({
      StackName: stackName(serverName),
      TemplateBody: templateBody,
      Parameters: params,
      Capabilities: [Capability.CAPABILITY_IAM],
    }),
  );
}

export function convertTo(options: Record<string, any>): { params: Parameter[]; discard: ParamsKey[] } {
  const params: Parameter[] = [];
  const discard: ParamsKey[] = [];

  if (options.admins) {
    if (/^(\w+)(,\w+)*$/.exec(options.admins)) {
      params.push({
        ParameterKey: ParamsKey.ADMINS,
        ParameterValue: options.admins,
      });
    } else {
      discard.push(ParamsKey.ADMINS);
    }
  }

  if (options.difficulty) {
    if (/^(peaceful|easy|normal|hard)$/.exec(options.difficulty)) {
      params.push({
        ParameterKey: ParamsKey.DIFFICULTY,
        ParameterValue: options.difficulty,
      });
    } else {
      discard.push(ParamsKey.DIFFICULTY);
    }
  }

  if (options.gamemode) {
    if (/^(creative|survival|adventure|spectator)$/.exec(options.gamemode)) {
      params.push({
        ParameterKey: ParamsKey.GAMEMODE,
        ParameterValue: options.gamemode,
      });
    } else {
      discard.push(ParamsKey.GAMEMODE);
    }
  }

  if (options.mem) {
    if (/(1|2|4|8|16)G/.exec(options.mem)) {
      params.push({
        ParameterKey: ParamsKey.MEMORY,
        ParameterValue: options.mem,
      });
    } else {
      discard.push(ParamsKey.MEMORY);
    }
  }

  if (options.playermax) {
    if (Number(options.playermax) > 0 && Number(options.playermax <= 100)) {
      params.push({
        ParameterKey: ParamsKey.PLAYERS_MAX,
        ParameterValue: options.playermax,
      });
    } else {
      discard.push(ParamsKey.PLAYERS_MAX);
    }
  }

  if (options.state) {
    if (/^(running|stopped)$/.exec(options.state)) {
      params.push({
        ParameterKey: ParamsKey.SERVER_STATE,
        ParameterValue: options.state,
      });
    } else {
      discard.push(ParamsKey.SERVER_STATE);
    }
  }

  if (options.viewdist) {
    if (Number(options.viewdist) > 0 && Number(options.viewdist <= 20)) {
      params.push({
        ParameterKey: ParamsKey.VIEW_DIST,
        ParameterValue: options.viewdist,
      });
    } else {
      discard.push(ParamsKey.VIEW_DIST);
    }
  }

  if (options.whitelist) {
    if (/^(\w+)(,\w+)*$/.exec(options.whitelist)) {
      params.push({
        ParameterKey: ParamsKey.WHITELIST,
        ParameterValue: options.whitelist,
      });
    } else {
      discard.push(ParamsKey.WHITELIST);
    }
  }

  if (options.timezone) {
    params.push({
      ParameterKey: ParamsKey.TIMEZONE,
      ParameterValue: options.timezone,
    });
  }

  return { params, discard };
}

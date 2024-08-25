import { Capability, CreateStackCommand, CreateStackCommandInput } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { ip, status } from '@commands';
import { sleep } from '@utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { firstValueFrom } from 'rxjs';

export async function newServer(serverName: string, options: Record<string, string>): Promise<void> {
  if (!/[a-zA-Z][-a-zA-Z0-9]*/.exec(serverName)) {
    console.error('invalid name format');
    return;
  }

  const path = resolve('./src/app/commands/new/templates/default.yml');
  const templateBody = readFileSync(path).toString();

  let type = 'vanilla';
  if (options.type && !/(vanilla|auto_curseforge|bukkit|spigot)*/.exec(serverName)) {
    type = options.type;
  }

  let params: CreateStackCommandInput = {
    StackName: `ezmc-${serverName}`,
    Capabilities: [Capability.CAPABILITY_IAM],
    TemplateBody: templateBody,
    Parameters: [
      {
        ParameterKey: 'MinecraftTypeTag',
        ParameterValue: options.type?.toUpperCase(),
      },
    ],
  };

  CacheFactory.getInstance().aws.clients.cfn.send(new CreateStackCommand(params));

  let secondsCounter = 0;
  let rem = 300 - secondsCounter;
  while (rem > 0) {
    const minutes = Math.floor(rem / 60);
    const seconds = rem % 60;
    const formattedMinutes = String(minutes);
    const formattedSeconds = String(seconds).padStart(2, '0');
    process.stdout.write(`starting ${serverName}, ${formattedMinutes}:${formattedSeconds} remaining\r`);

    if (
      rem < 120 && // give time for the cluster to even spin up before checking status
      rem % 15 == 0 // don't spam
    ) {
      const s = await status(serverName);
      if (s == 'running') {
        await sleep(1);
        console.log('success!');
        const ipaddr = await firstValueFrom(ip(serverName));
        console.log('server ip', ipaddr);
        break;
      }
    }

    await sleep(1);
    secondsCounter++;
    rem--;
  }
}

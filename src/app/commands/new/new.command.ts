import { Capability, CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { ip, status } from '@commands';
import { sleep, stackExistsOrThrow } from '@utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { firstValueFrom } from 'rxjs';

export async function newServer(serverName: string): Promise<void> {
  if (!/[a-zA-Z][-a-zA-Z0-9]*/.exec(serverName)) {
    console.error('invalid name format');
    return;
  }

  return stackExistsOrThrow(serverName).then(async () => {
    const path = resolve('./src/app/commands/new/templates/default.yml');
    const templateBody = readFileSync(path).toString();

    const cache = await CacheFactory.getInstance();
    const client = new CloudFormationClient({ region: cache.aws.region });
    client.send(
      new CreateStackCommand({
        StackName: `ezmc-${serverName}`,
        Capabilities: [Capability.CAPABILITY_IAM],
        TemplateBody: templateBody,
      }),
    );

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
  });
}

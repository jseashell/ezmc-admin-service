import { Capability, CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import { CacheFactory } from '@cache';
import { sleep, stackExists } from '@utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ipAddress } from '../ipaddr/ipaddr.command';
import { status } from '../status/status.command';

export async function newServer(serverName: string) {
  if (!serverName || !serverName.match(/[a-zA-Z][-a-zA-Z0-9]*/)) {
    console.error('invalid name format');
    return;
  }

  const alreadyExists = await stackExists(serverName);
  if (alreadyExists) {
    console.error(`${serverName} already exists, please try again...`);
    return;
  }

  const path = resolve('./src/templates/default.yml');
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
    process.stdout.write(`bootstrapping server, ${formattedMinutes}:${formattedSeconds} remaining\r`);

    if (
      rem < 120 && // give time for the cluster to even spin up before checking status
      rem % 15 == 0 // don't spam
    ) {
      const s = await status(serverName);
      if (s?.toLowerCase() == 'running') {
        await sleep(1);
        console.log('success!');
        const ip = await ipAddress(serverName);
        console.log('server ip', ip);
        break;
      }
    }

    await sleep(1);
    secondsCounter++;
    rem--;
  }
}

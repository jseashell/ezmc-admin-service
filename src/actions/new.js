import { Capability, CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { yamlParse } from 'yaml-cfn';
import { ipAddress } from './ipaddr.js';
import { status } from './status.js';

export async function newServer(serverName) {
  const path = resolve('./src/templates/default.yml');
  const templateBody = readFileSync(path).toString();

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const client = new CloudFormationClient({ region: region });
  client.send(
    new CreateStackCommand({
      StackName: `ezmc-${serverName}`,
      Capabilities: [Capability.CAPABILITY_IAM],
      TemplateBody: templateBody,
    }),
  );

  const template = yamlParse(templateBody);
  await sleep(1);
  console.log(`gamemode            ${template.Parameters.GameMode.Default}`);
  await sleep(1);
  console.log(`difficulty          ${template.Parameters.Difficulty.Default.toLowerCase()}`);
  await sleep(1);
  console.log(`admin list          ${template.Parameters.AdminPlayerNames.Default?.toLowerCase() || 'none'}`);
  await sleep(1);
  console.log(`max players         ${template.Parameters.MaxPlayers.Default}`);
  await sleep(1);
  console.log(`seed                ${template.Parameters.Seed.Default?.toLowerCase() || 'none'}`);
  await sleep(1);
  console.log(`level type          ${template.Parameters.LevelType.Default.toLowerCase()}`);
  await sleep(1);
  console.log(`view dist           ${template.Parameters.ViewDistance.Default}`);
  await sleep(1);

  let secondsCounter = 0;
  let rem = 120 - secondsCounter;
  while (rem > 0) {
    process.stdout.write(`server starting in ${rem} seconds\r`);
    await sleep(1);
    rem--;
  }

  // retry routine
  while (true) {
    const s = await status(serverName);
    if (s?.toLowerCase() == 'running') {
      console.log('success!');

      const ip = await ipAddress(serverName);
      console.log('server ip', ip);
      break;
    } else {
      await sleep(1);
      secondsCounter++;
    }
  }
}

/**
 * sleeps the given number of seconds
 * @param {number} n
 * @returns async sleep
 */
const sleep = async (n) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, n * 1000);
  });
};

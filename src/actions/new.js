import {
  Capability,
  CloudFormationClient,
  CreateStackCommand,
  DescribeStacksCommand,
} from '@aws-sdk/client-cloudformation';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ipAddress } from './ipaddr.js';
import { status } from './status.js';

export async function newServer(serverName) {
  if (!serverName || !serverName.match(/[a-zA-Z][-a-zA-Z0-9]*/)) {
    console.error('invalid name format');
    return;
  }

  const region = process.env.AWS_REGION;
  if (!region) {
    console.error('missing aws region');
    return;
  }

  const awsAccountId = process.env.AWS_ACCOUNT_ID;
  if (!awsAccountId) {
    console.error('missing aws account id');
    return;
  }

  const alreadyExists = await stackExists(serverName, region);
  if (alreadyExists) {
    console.error(`${serverName} already exists, please try again...`);
    return;
  }

  const path = resolve('./src/templates/default.yml');
  const templateBody = readFileSync(path).toString();

  const client = new CloudFormationClient({ region: region });
  client.send(
    new CreateStackCommand({
      StackName: `ezmc-${serverName}`,
      Capabilities: [Capability.CAPABILITY_IAM],
      TemplateBody: templateBody,
    }),
  );

  let secondsCounter = 0;
  let rem = 130 - secondsCounter;
  while (rem > 0) {
    process.stdout.write(`bootstrapping server, ${rem} seconds remaining\r`);

    if (
      rem < 100 && // give time for the cluster to even spin up before checking status
      rem % 5 == 0 // don't spam
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

const stackExists = async (serverName, region) => {
  try {
    const client = new CloudFormationClient({ region: region });
    const response = await client.send(
      new DescribeStacksCommand({
        StackName: 'ezmc-' + serverName,
      }),
    );

    if (response.Stacks && response.Stacks.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.name === 'ValidationError' && error.message.includes('does not exist')) {
      return false;
    } else {
      throw error;
    }
  }
};

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

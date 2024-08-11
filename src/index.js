import 'dotenv/config';

import { program } from 'commander';
import { ipAddress } from './commands/ipaddr.js';
import { list } from './commands/list.js';
import { newServer } from './commands/new.js';
import { remove } from './commands/remove.js';
import { start } from './commands/start.js';
import { status } from './commands/status.js';
import { stop } from './commands/stop.js';

program.name('ezmc').description('CLI for self-hosting a Minecraft Java server with AWS ECS.').version('0.1.0');

program
  .command('ipaddr')
  .description('displays the server ip address')
  .requiredOption('-n, --name <string>', 'server name')
  .action(async (options) => {
    const ip = await ipAddress(options.name);
    console.log(ip);
  });

program
  .command('ls')
  .description('displays a list of your ezmc servers')
  .action(async () => {
    const res = await list();
    console.log(res);
  });

program
  .command('new')
  .description('spins up a new server')
  .requiredOption('-n, --name <string>', 'alphanumeric and hyphens only. must start with alpha character')
  .action(async (options) => {
    if (!options.name || !options.name.match(/[a-zA-Z][-a-zA-Z0-9]*/)) {
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

    console.log(`creating ${options.name} in ${region}, please wait...`);
    newServer(options.name);
  });

program
  .command('rm')
  .description('tear down a server (cannot be undone)')
  .requiredOption('-n, --name <string>', 'server name')
  .action((options) => {
    remove(options.name);
  });

program
  .command('start')
  .description('starts a server')
  .requiredOption('-n --name', 'server name')
  .action((options) => {
    start(options.name);
  });

program
  .command('status')
  .description('displays the server status')
  .requiredOption('-n, --name <string>', 'server name')
  .action(async (options) => {
    const res = await status(options.name);
    console.log(res);
  });

program
  .command('stop')
  .description('stops a server')
  .requiredOption('-n, --name <string>', 'server name')
  .action((options) => {
    stop(options.name);
  });

function errorColor(str) {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}

program.configureOutput({
  // Visibly override write routines as example!
  writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
  writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
  // Highlight errors in color.
  outputError: (str, write) => write(errorColor(str)),
});

program.parse();

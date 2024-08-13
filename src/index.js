#!/usr/bin/env node

import 'dotenv/config';

import { program } from 'commander';
import { copyIpAddress } from './actions/copy-ipaddr.js';
import { ipAddress } from './actions/ipaddr.js';
import { list } from './actions/list.js';
import { newServer } from './actions/new.js';
import { remove } from './actions/remove.js';
import { start } from './actions/start.js';
import { status } from './actions/status.js';
import { stop } from './actions/stop.js';

program.name('ezmc').description('CLI for self-hosting a Minecraft Java server with AWS ECS.').version('0.1.0');

program
  .command('cip')
  .description("copies a server's ip address to the clipboard")
  .argument('<string>', 'server name')
  .action((serverName) => copyIpAddress(serverName));

program
  .command('ip')
  .description('displays the server ip address')
  .argument('<string>', 'server name')
  .action((serverName) => ipAddress(serverName).then((ip) => console.log(ip)));

program
  .command('ls')
  .description('displays a list of your ezmc servers')
  .action(() => list().then((res) => console.log(res)));

program
  .command('new')
  .description('spins up a new server')
  .argument('<string>', 'server name. alphanumeric and hyphens only. must start with alpha character')
  .action((serverName) => newServer(serverName));

program
  .command('rm')
  .description('tear down a server (cannot be undone)')
  .argument('<string>', 'server name')
  .action((serverName) => remove(serverName));

program
  .command('start')
  .description('starts a server')
  .argument('<string>', 'server name')
  .action((serverName) => start(serverName));

program
  .command('status')
  .description('displays the server status')
  .argument('<string>', 'server name')
  .action(async (serverName) => status(serverName).then((res) => console.log(res)));

program
  .command('stop')
  .description('stops a server')
  .argument('<string>', 'server name')
  .action(async (serverName) => stop(serverName));

program.configureOutput({
  outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`),
});

program.parse();

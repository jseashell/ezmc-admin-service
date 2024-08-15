#!/usr/bin/env node

import 'dotenv/config';

import { addop, copyIpAddress, getParams, ipaddr, list, newServer, rm, rmop, start, status, stop } from '@commands';
import { program } from 'commander';
import { CacheFactory } from './cache/cache.factory';

program.name('ezmc').description('CLI for self-hosting a Minecraft Java server with AWS ECS.').version('0.1.0');

program
  .command('addop')
  .description('adds a player to the admin list')
  .argument('<string>', 'server name')
  .argument('<string>', 'player name')
  .action((serverName, playerName) => addop(serverName, playerName));

program
  .command('cip')
  .description("copies a server's ip address to the clipboard")
  .argument('<string>', 'server name')
  .action((serverName) => copyIpAddress(serverName));

program
  .command('ip')
  .description('displays the server ip address')
  .argument('<string>', 'server name')
  .action((serverName) => ipaddr(serverName).then((ip) => console.log(ip)));

program
  .command('ls')
  .description('displays a list of your ezmc servers')
  .action(() => list().then((res) => console.log(res)));

program
  .command('maxp')
  .description('updates the max player count')
  .argument('<string>', 'server name')
  .argument('<number>', 'desired max number of players')
  .action((serverName, maxPlayers) => maxPlayers(serverName, maxPlayers));

program
  .command('new')
  .description('spins up a new server')
  .argument('<string>', 'server name. alphanumeric and hyphens only. must start with alpha character')
  .action((serverName) => newServer(serverName));

program
  .command('params')
  .description('get/set server parameters')
  .argument(`<get|set>`, 'action to take')
  .argument('<string>', 'server name')
  .option('-a, --admin <string>', 'list of admin player names. comma-delimited, no spaces')
  .option('-d, --difficulty [peaceful|easy|normal|hard]', 'the game difficulty')
  .option('-g, --gamemode [creative|survival|adventue|spectator]')
  .option('-m, --maxplayers <number>', 'the maximum amount of simultaneous players')
  .option('-r, --ram, --mem [1G|2G|4G|8G]', 'amount of memory to allocate to the jvm')
  .option('-s, --state [running|stopped]', 'server state')
  .option('-v, --viewdist <number>', 'view distance')
  .option('-w, --whitelist <string>', 'list of whitelisted player names. comma-delimited, no spaces')
  .option(
    '-z, --timezone <string>',
    "the server's timezone. use the canonical name of the format, e.g. America/New_York",
  )
  .action((action, serverName, options) => {
    if (action == 'get') {
      getParams(serverName);
    } else if (action == 'set') {
      console.log(options);
    }
  });

program
  .command('rm')
  .description('tear down a server (cannot be undone)')
  .argument('<string>', 'server name')
  .action((serverName) => rm(serverName));

program
  .command('rmop')
  .description('removes a player from the admin list')
  .argument('<string>', 'server name')
  .argument('<string>', 'player name')
  .action((serverName, playerName) => rmop(serverName, playerName));

program
  .command('start')
  .description('starts a server')
  .argument('<string>', 'server name')
  .action(async (serverName) => start(serverName));

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

CacheFactory.getInstance().then(() => {
  program.parse();
});

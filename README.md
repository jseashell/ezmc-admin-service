# EZMC CLI

Server management CLI for self-hosting Minecraft Java Edition with AWS Elastic Container Service. This CLI is a wrapper around [itzg/minecraft-server](https://github.com/itzg/docker-minecraft-server) Docker image and the AWS SDK that contains useful commands for orchestrating containers without logging in or using the AWS directly (after initial account creation and billing setup).

## Usage

```sh
# clone the repo
git clone git@github.com:jseashell/ezmc-cli.git
# install dependencies
npm install
# build the project
npm run build
# create your server
ezmc new s1
# after a short wait you'll see:
# server ip 168.192.0.1
```

> Requires Node.js v20+

## Commands

| Command  | Description                                                                                            |
| :------- | :----------------------------------------------------------------------------------------------------- |
| `cip`    | Copies a server's ip address to the clipboard                                                          |
| `ip`     | Displays a server's ip address                                                                         |
| `ls`     | Displays a list of your ezmc servers                                                                   |
| `new`    | Creates a new server. Wait a few minutes for commands like `ipaddr` or `status` to function.           |
| `rm`     | Removes a server (cannot be undone). Wait a few minutes after stopping a server to remove it entirely. |
| `start`  | Starts a server                                                                                        |
| `status` | Displays a server's status                                                                             |
| `stop`   | Stops a server                                                                                         |
| `help`   | Displays cli help                                                                                      |

## Options

### Defaults

| Option        |  Value   |
| :------------ | :------: |
| Max players   |    20    |
| Difficulty    |  Normal  |
| View Distance |    10    |
| Game Mode     | Survival |
| Level Type    | Default  |
| Seed          |    -     |
| Admin Players |    -     |
| Op List       |    -     |

## Infrastructure

AWS Elastic Container Service is used to deploy the Minecraft image. EC2 instance(s) are spun up upon request and remain running until told to shutdown via the `stop` command. Remove the server entirely with `rm` (after stop has completed).

> Contributors are not responsible for any AWS costs incurred from using this CLI. Use at your own discretion.

Each server is given its own ECS cluster, with one service, running one task -- ez.

## License

This project is distributed under the terms of the [MIT License](./LICENSE).

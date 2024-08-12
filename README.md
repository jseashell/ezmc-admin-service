# EZMC Game Server

Server management CLI for self-hosting Minecraft Java Edition in your AWS account. This CLI is a wrapper around [itzg/minecraft-server](https://github.com/itzg/docker-minecraft-server) Docker image and the AWS SDK that contains useful commands for managing resources without logging in or using the AWS directly (after initial account creation and billing setup).

## Usage

```sh
# clone the repo
git clone git@github.com:jseashell/ezmc-cli.git
# install dependencies
npm install
# link to your global packages to enable
npm link
# create your server
ezmc new s1
# after a short wait...direct connect
server ip 168.192.0.1
```

> Requires Node.js v20+

## Commands

| Command  | Description                                                                                            |
| :------- | :----------------------------------------------------------------------------------------------------- |
| `ipaddr` | Displays a server's ip address                                                                         |
| `ls`     | Displays a list of your ezmc servers                                                                   |
| `new`    | Creates a new server. Wait a few minutes for commands like `ipaddr` or `status` to function.           |
| `rm`     | Removes a server (cannot be undone). Wait a few minutes after stopping a server to remove it entirely. |
| `start`  | Starts a server                                                                                        |
| `status` | Displays a server's status                                                                             |
| `stop`   | Stops a server                                                                                         |

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

## License

This project is distributed under the terms of the [MIT License](./LICENSE).

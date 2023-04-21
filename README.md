# EZMC Game Service

Game management service for the EZ Minecraft stack via RESTful API.

## Install

```sh
git clone https://github.com/jseashell/ezmc-admin-service.git
cd ezmc-admin-service
npm install
```

> Requires Node.js v18+. If using [nvm](https://nvm.sh), run `nvm use` to setup Node.js.

## Running the App

Emulate the AWS environment offline locally and request the API

```sh
npm run offline
...
Listening on port 3000
```

Spin up the first game server

```sh
curl localhost:3000/main/up \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"accountId": "00000001", "serverName": "Test Server"}'
```

Get the server IP address

```sh
curl localhost:3000/main/ipAddress \
  -X GET \
  -H 'Content-Type: application/json' \
  -d '{"clusterName": "ecs_cluster_name"}'
```

## API

|Endpoint|Method|Description|Request|Response|
|--------|------|-----------|-------|--------|
|`/down`|`POST`|Tears down a game server. Data is not retained.|<pre>{<br/>  "accountId": "000001",<br/>  "serverName: "Test Server"<br/>}</pre>|<pre>{<br/>  "message": "Success",<br/>  "data": ...<br/>}</pre>|
|`/ipAddress`|`GET`|Gets the public IP address for a game server.|<pre>?clusterName=000001</pre>|<pre>{<br/>  "ipAddress": "192.168.0.1"<br/>}</pre>|
|`/start`|`POST`|Starts an existing game server that is stopped.|<pre>{<br/>  "clusterName": "ecs_cluster_name",<br/>}</pre>|<pre>{<br/>  "message": "Success",<br/>  "data": ...<br/>}</pre>|
|`/status`|`GET`|Gets the running status for a game server.|<pre>?clusterName=000001</pre>|<pre>{<br/>  "ipAddress": "192.168.0.1"<br/>}</pre>|
|`/stop`|`POST`|Stops an existing game server that is running.|<pre>{<br/>  "clusterName": "ecs_cluster_name",<br/>}</pre>|<pre>{<br/>  "message": "Success",<br/>  "data": ...<br/>}</pre>|
|`/up`|`POST`|Spins up a new game server|<pre>{<br/>  "accountId": "000001",<br/>  "serverName: "Test Server"<br/>}</pre>|<pre>{<br/>  "message": "Success",<br/>  "data": ...<br/>}</pre>|

## Deployment

This microservice is deployed using [Serverless Framework](https://www.serverless.com/framework/docs), which leverages a [Cloudformation template](https://aws.amazon.com/cloudformation/resources/templates/) to provision cloud resources for supporting this REST API.

```sh
npx serverless deploy --stage $STAGE --region $REGION --verbose
```

> `$STAGE` and `$REGION` are optional. The deployment will be staged as `main` to the `us-east-1` region.

Deployment is executed by [Github Actions](https://docs.github.com/en/actions). See [github-actions.yml](./.github/workflows/github-actions.yml) for configuration.

## Project structure

The project code base is mainly located within the `src` folder.

```text
.
├── .github                # CI/CD config
├── .husky                 # Git hooks
├── src
│   ├── functions          # Lambda functions
│   └── libs               # Shared code
├── .eslintrc.js           # Lint config
├── .gitignore
├── .nvmrc                 # NVM config
├── .prettierignore        # Code style ignore patterns
├── .prettierrc.yml        # Code style config
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── serverless.ts          # Serverless config
├── tsconfig.json          # Typescript config
└── tsconfig.paths.json    # Typescript import path shortcuts
```

## License

This project is distributed under the terms of the [MIT License](./LICENSE).

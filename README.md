# EZMC Game Service

Game management service for the EZ Minecraft stack via RESTful API.

## Install

```sh
npm i -g ezmc
```

> Requires Node.js v20+

## Commands

### create

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

# Basilisk UI

Storybook based front-end for Basilisk parachain employing react-use hooks and Apollo Client for data layer.

## Develop

Use yarn to install dependencies

```
yarn install
```

Start Storybook component development environment.

```
yarn storybook
```

Storybook can be opened at [:6006](http://localhost:6006)

Run the app in the development mode locally.

_Requires to have [Basilisk API](https://github.com/galacticcouncil/Basilisk-api#readme) testnet running and
optionally its indexer and processor as well._

```
yarn start
```

Open [:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.\
You will also see any lint errors in the console.

Start tests interactive mode

```
yarn test
```

## Deploy

GitHub Actions Workflow is configured for deployment of UI application and Storybooks
at the same time. Each branch `develop|feat|fix/**` deploys to appropriate folder in `app-builds-gh-pages` branch.
Branch folder contains 2 sub-folders: `app` and `storybook` for UI app and Storybook builds
accordingly.

App UI builds and Storybooks are hosted in GitHub Pages.

For access to the builds you can use these paths:

- **UI app** - `https://galacticcouncil.github.io/basilisk-ui/<folder_name>/<subfolder_name?>/app`
- **Storybook build** - `https://galacticcouncil.github.io/basilisk-ui/<folder_name>/<subfolder_name?>/storybook`

Deployment triggers:

```yaml
push:
  branches:
    - develop
    - 'fix/**'
    - 'feat/**'
pull_request:
  branches:
    - 'fix/**'
    - 'feat/**'
```

To build optimized production artifacts locally you can run

```
yarn build
```

## Code style

To ensure consistent code across our codebase, we're using both Prettier and ESLint.
You can either use `yarn lint / yarn lint --fix` or `yarn prettier / yarn prettier --write`,
or make use of the built-in pre-commit prettier & linting for staged files.

### VSCode extensions

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## FAQ

### Why my build fails on `error:03000086:digital envelope routines::initialization error` ?

You have to use legacy openssl provider in node 17+. Set this to node options

```
export NODE_OPTIONS=--openssl-legacy-provider
```

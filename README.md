# Basilisk UI

Storybook based front-end for Basilisk parachain employing react-use hooks and Apollo Client for data layer.

## Develop

Use yarn to install dependencies

```
yarn install
```

Start Storybook component development environment.

```
yarn storybook:start
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

- **UI app** - `https://galacticcouncil.github.io/Basilisk-ui/<folder_name>/<subfolder_name?>/app`
- **Storybook build** - `https://galacticcouncil.github.io/Basilisk-ui/<folder_name>/<subfolder_name?>/storybook`

Deployment triggers:

```yaml
push:
  branches:
    - develop
    - 'fix/**'
    - 'feat/**'
    - 'release/**'
pull_request:
  branches:
    - 'develop'
```

To build optimized production artifacts locally you can run

```
yarn build
```

## Code style

To ensure consistent code across our codebase, we're using both Prettier and ESLint.
You can either use `yarn lint / yarn lint --fix` or `yarn prettier / yarn prettier --write`,
or make use of the built-in pre-commit prettier & linting for staged files.

## UI Architecture

This section outlines the approaches followed while implementing this UI as a React app, including the distinction
between different application layers.

### Presentational layer

The presentational layer is used to present and transform the normalized data provided by the *composition layer*. It begins on the *dumb* component level,
those are fed data via containers through props. Dumb components should be developed in isolation via *storybook* to fit the visual/layout/structural design requirements. Dumb components should only hold local state specific to their own presentational logic (e.g. `isModalOpen`), and should communicate with their respective parent components via props and handlers (e.g. `onClick / handleOnClick`).

Example:

```tsx
// reuse generated models from the data layer
import { Account } from './generated/graphql'

// data to be presented passed via props
export interface WalletProps {
  activeAccount?: Account,
  onActiveAccountClick: () => void
}

export const Wallet = ({ account, onActiveAccountClick }: WalletProps) => {
  return <div onClick={_ => onActiveAccountClick()}>
    <p>{account?.name}</p>
  </div>
}
```
### Presentational layer testing strategy
Our presentation layer testing strategy is based on a combination of storybook `stories`  and `playwright`. Each presentation layer component _must_ have a useful `.stories.tsx` file to go along with it.  

Storybook serves the  `.stories.tsx` file,  and then we use Playwright to visit that story to test and screenshot each aspect, variation, and interaction. 

- Best to look in this repo at the `.stories.test.ts` files and their corresponding `.stories.tsx` files to see how this works  

- Generating Screenshots:
  - If you run a `stories.test.tsx` containing a screenshot comparison test,  but a screenshot is missing/deleted, then the test will fail. _But_ even though it fails, Playwrite will take a screenshot of whatever is there,  and use it for comparison subsequently. It will tell you it did that in the console.  You can replace an existing screenshot in this way.

  - Find all screenshots in `storybook-testing/screenshots-to-test-against`

  - when any screenshot comparison fails,  find results in `storybook-testing/results/screenshot-comparison-fails`

- Scripts:

  - Running `.stories.test` file(s):
    - start storybook ( `yarn storybook:start` ), then run <code><pre><span style="color: blue">yarn</span> <span style="color: green">storybook:test</span> <file name(s)> </pre></code>

      - example: <code><pre><span style="color: blue">yarn</span> <span style="color: green">storybook:test</span> Button.stories.test AssetBalanceInput</pre></code> 
        *`AssetBalanceInut` works; the `file-name` doesn't have to be complete
    
    <br />
    
    - Omit `<file name(s)>` to run _all_ the `.stories.test` files

    <br />

  - Debugging: 
    - append `--headed` flag to the above script to see test execution in-browser,  and when using [`page.pause`](https://playwright.dev/docs/debug#browser-developer-tools)

    <br />

  - CI:
    - `yarn storybook:test:ci` starts storybook for you and runs the entire Storybook + Playwright testing infrastructure.  

- Links

  - [Playwright docs](https://playwright.dev/)
  - [Playwright debugging](https://playwright.dev/docs/debug#browser-developer-tools)
  - [Intro to writing Storybook stories](https://storybook.js.org/docs/react/writing-stories/introduction)

### Composition layer

The composition layer brings together the *presentational layer* and the *data layer*. Instead of dumb components, *smart containers* should be utilized to orchestrate fetching of the data required for presentational layer. The aforementioned containers should not contain any direct data fetching themselves, but instead they should utilize simple-to-complex GraphQL queries. This ensures a clear separation of concerns, and allows for a transparent data flow and debugging.

One of the major roles of the composition layer is to determine when data should be initially fetched (or subsequently refetched). Since our data layer is powered by the [Apollo client](https://www.apollographql.com), fetching any data means just dispatching a query to the client itself. If data isn't present in the data layer's normalized cache, sending a query will trigger actual fetching of the data - e.g. from a remote source (depending on the underlying data layer implementation). 

There are a few approaches to data composition within our UI:

1. `useQuery` - this will immediately request data via the data layer's resolvers
2. `useLazyQuery` - this will return a callback, that can be timed or manually executed to request the data at a later time (e.g. after a timeout or on user interaction)
3. `constate` - both query types can be contextualized to avoid concurrency issues in a case where multiple containers use the same queries at the same times (at time of rendering)
4. `cache.readQuery / cache.readFragment` - this will only read already cached data, without making a roundtrip to the data resolver.

#### Handling loading statuses

Loading statuses in Apollo are mostly represented in two ways, one is via a `loading` property returned from both queries and mutations. The second one is the `networkStatus` which is available and updated if `notifyOnNetworkStatusChange: true` in the query/mutation options. 

> Please make sure to set `notifyOnNetworkStatusChange: true` on your queries and mutations.

Example:

```tsx
import { Wallet as WalletComponent } from './components/Wallet'
import { Query } from './generated/graphql'

export interface GetActiveAccountQueryResponse {
  // you have to be extra careful when composing the generated types, this issue leaks to the data layer itself in terms of the data returned from a query
  activeAccount: Query['activeAccount']
}

// query
export const GET_ACTIVE_ACCOUNT = gql`
  query GetActiveAccount {
    activeAccount {
      name,
      id,
      balances
    }
  }
`;
export const useGetActiveAccountQuery = () => useQuery<GetActiveAccountQueryResponse>(GET_ACTIVE_ACCOUNT);

// container
export const Wallet = () => {
  // request data from the data layer
  const { data: { activeAccount } } = useGetActiveAccountQuery(); 
  // render the component with the provided data
  return <WalletComponent activeAccount={activeAccount} />
}
```

### Data layer

The data layer is provided by the [Apollo client](https://www.apollographql.com), containers are not aware of where the data comes from, they only define what data they're interested in. We use Apollo's [local resolvers](https://www.apollographql.com/docs/react/local-state/local-resolvers/) to provide the data that is being requested by containers via queries.

Local resolver is a function that can be parametrized via a query, which returns (resolves) data for the given entity (e.g. Accounts).
As far as separation of concerns goes in the data layer itself, the resolver should only parse out the query arguments and call subsequent functions that take care of the data fetching itself.

Fetching of data is facilitated by query resolvers, writing of data (both local and remote) is facilitated by mutation resolvers.


> Please refer to `src/hooks/extension` for a simple example of a folder structure & code separation. 

#### Testing

Queries and resolvers should be tested in unison, this can be easily done by writing an integration test that sets up a resolver and a component that consumes it via a query. Resolver internals can be mocked in order to make the testing easier. Please look at `src/hooks/extension/resolvers/query/extension.test.tsx` for reference.

#### Data freshness and historical data

Overall strategy for data fetching in our UI is to provide the latest possible data using the Basilisk node itself. This ensure that our users are presented with the latest possible data, and can make well informed decision for e.g. trading. Our current backend infrastructure ((Basilisk API)[https://github.com/galacticcouncil/Basilisk-api]) only processes finalized data - which can and will be more than 3 blocks behind the actual latest data on-chain.

Thanks to our local resolver architecture, we can compose various data sources easily and serve them in an unified manner via complex queries.

Example of a query resolver:

```typescript
export interface PoolResolverArgs {
  assetIds?: { assetAId: string, assetBId: string },
  id?: string
}

export const getPoolIdFromAssetIds = (...) => {...}

export const withTypename = (pool: Pool) => {
  const __typename = pool.__typename === 'LBPPool' ? 'LBPPool' : 'XYKPool';
  return {
    __typename,
    ...pool
  }
};

/**
 * Resolver for the `Pool` entity is a simple factory function,
 * accepting dependencies as arguments and returning the resolver itself
 */
export const poolResolverFactory = (
  apiInstance: ApiInstance,
) => async (
  _obj,
  args: PoolResolverArgs
) => {
  let poolId = args.assetIds ? await getPoolIdFromAssetIds(args.assetIds) : args.id;
  if (!poolId) throw new Error('poolId not found');

  const pool = await getPool(apiInstance,poolId);

  return withTypename(pool)
}

/**
 * In order to access contextual dependencies, the resolver
 * must be wrapped as a hook
 */
export const usePoolResolver = () => useCallback(() => {
  // polkadot.js api instance from the parent context
  const { apiInstance } => usePolkadotJsContext();

  return {
    Query: {
      /**
       * Passed by reference, so that apollo can use
       * the latest function after the dependencies for the resolver change.
       */
      pool: useResolverToRef(useMemo(
        () => poolResolverFactory(apiInstance), 
        [apiInstance, pool]
      ))
    }
  }
});
```

## Contributing

### Tests code coverage
All application layers must be tested as full as it's possible. At the moment we don't set strict
rule for tests coverage threshold, but there is temporary soft rule for all new files - 
**each new file must have tests coverage not less than 90%**.



### Conventional naming for commits and pull-requests


We are using conventional commits and pull-requests naming strategy. Specification for conventional naming can be 
found [here](https://www.conventionalcommits.org/en/v1.0.0/#specification).

**Commits:**
For making conventional commits, you can run `yarn commit` and go through commit flow or add
conventional commit message manually.

**Pull-request:**
Each pull-request name must fit to Conventional Commits messaging strategy.

For successful merge of any PR it must fit to the next requirements:
- at least 1 review from repository contributors;
- review from Code Owner;
- working branch must be up to date before merge;
- all conversation must be resolved;
- [Semantic Pull Requests](https://github.com/zeke/semantic-pull-requests) check must be successfully passed. 
Next types for pull-requests are supported:
  - `feat`
  - `fix`
  - `docs`
  - `style`
  - `refactor`
  - `perf`
  - `test`
  - `build`
  - `ci`
  - `chore`
  - `revert`


## Testing

### App unit testing

For unit testing we use [Jest](https://jestjs.io/). All app unit testing configs are defined 
in `craco.config.js` in `jest` section.

For running all unit tests execute next command:
```shell
# Local testing
yarn test

# Testing in CI flow
yarn test:ci
```

Testing process provides code coverage report in terminal as a text output and detailed report
in `./coverage` folder. Moreover, detailed report is used in GH Action testing workflow for publication coverage report as 
comment in appropriate pull-request.
`./coverage/lcov-report/index.html` can be open in web-browser for 
investigation of coverage details.

If you need to test specific file and get code coverage report for this file, use this approach:
```shell
yarn test <test-file-name.test.tsx> --collectCoverageOnlyFrom=<tested-file-name.tsx>

# For instance:
yarn test src/hooks/balances/resolvers/query/balances.test.tsx --collectCoverageOnlyFrom=src/hooks/balances/resolvers/query/balances.tsx
```


### App E2E testing

#### Build Polkadot extension

1. Clone polkadot-dapp [repo](https://github.com/polkadot-js/extension) to `./polkadot-dapp` folder
2. use Node.js v16.13.2
3. `cd extension`
4. `yarn`
5. `yarn build`
6. Unzip newly built archive `master-build` to the same folder as archive's root. All necessary
   extension files are located in `master-build` folder which can be used as dapp src root.

#### E2E Testing requirements

GH Actions musk have configured next Repo secrets:
```yaml
E2E_TEST_ACCOUNT_NAME_ALICE
E2E_TEST_ACCOUNT_PASSWORD_ALICE
E2E_TEST_ACCOUNT_SEED_ALICE
```
For local running e2e tests root project's folder must contain `.env.test.e2e.local` config file with the same 
variable definitions as `.env.test.e2e.ci` but with replaced `__VAR_NAMER__` placeholders to real values (these placeholders are replacing to 
repo secrets during GH Actions workflow). 

For running e2e test locally you should:
1) `npx playwright install` if necessary
2) Build UI project
3) Run local testnet (with Basilisk-api).
4) Run built UI project in local server `http://127.0.0.1:3000` (can be `yarn start`)
5) Run tests with `yarn test:e2e-local`
6) Check testing results in `ui-app-e2e-results.html` and screenshots in `./traces`


### Storybook testing

For running tests Storybook server must be running:
```shell
yarn storybook:start
```
Storybook built can used by any other server in porn `6006`. For instance:
```shell
yarn storybook:build

#use node.js server library http-server
http-server storybook-static --port 6006
```

Run tests:
```shell
yarn storybook:test
```

#### Watch
As watcher library we are using [chokidar-cli](https://github.com/open-cli-tools/chokidar-cli) .

For testing storybook in watch mode Storybook server must be running:
```shell
yarn storybook:start
```
Watcher can be started in separate terminal window:
```shell
yarn storybook:test:watch

#or in --headed mode
yarn storybook:test:watch-headed
```


## Github Actions workflows

More details [here](./docs/CI.md)

## Application release flow

More details [here](./docs/RELEASE.md)


## VSCode extensions

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## FAQ

### Why does my build fail on `error:03000086:digital envelope routines::initialization error`?

You have to use legacy openssl provider in node 17+. Set this to node options

```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

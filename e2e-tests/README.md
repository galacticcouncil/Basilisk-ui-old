## Build Polkadot extension

1. Clone polkadot-dapp [repo](https://github.com/polkadot-js/extension) to `./polkadot-dapp` folder
2. `cd extension`
3. `yarn`
4. `yarn build`
5. Unzip newly built archive `master-build` to the same folder as archive's root. All necessary
   extension files are located in `master-build` folder which can be used as dapp src root.

## E2E Testing requirements

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
1) Build UI project
2) Run testnet
3) Run built UI project in local server `http://127.0.0.1:3000`
4) Run tests with `yarn test:e2e-local`



## Github Actions workflows

`E2E and Unit Testing Flow` (`.github/workflows/e2e-and-unit-tisting-flow.yml`) workflow generates testing reports and 
screenshots traces which are available as artifacts in this workflow.

Possible artifacts:
- `ui-app-e2e-results.html`
- `ui-app-unit-tests-results.html`
- `traces` (contains bunches of screenshots for each test separately)

`Add artifact links to pull request` (`.github/workflows/publish-testing-artifacts-to-pr-comment.yml`) workflow runs 
after each `E2E and Unit Testing Flow` ([workflow_run](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#workflow_run)) 
and publishes names and links of available artifacts after tests as comment in related PR, which has triggered
`E2E and Unit Testing Flow` workflow. 
`Add artifact links to pull request` workflow must be published in **default branch** of the repo (currently it's `develop`). 
Workflow config from default branch will be used for all actions 
( [... will only trigger a workflow run if the workflow file is on the default branch.v](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#workflow_run) ).



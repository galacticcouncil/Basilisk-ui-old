# Basilisk UI releases convention

Basilisk-UI releases comply with [Semantic Versioning](https://semver.org/) and implies existence of `develop` as 
working branch and `main` branch as production source (accordingly Gitflow strategy). 
Each release has it's own tag and release notes, which are extracted from CHANGELOG.md. 
Changelog is based on [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/). Use [these 
rules](https://semver.org/#spec-item-4) for proper commit messages and versions bumping. 

---

### New release creation flow
Creation of new release flow contains manual and automated by GitHub Actions steps. For creation of a new release:
1) Manually run workflow [Release :: Prepare (dispatch)](/.github/workflows/_dispatch_prepare-release.yml).
This workflow:
   - updates application version in `package.json` regarding provided parameters (look to the comments inside workflow file);
   - generates changelog accordingly of conventional commit messages;
   - create tag for a new release;
   - creates branch for a new release (`release/vX.X.X`);
   - creates pull requests `develop <- release/vX.X.X` and `main <- release/vX.X.X`.
2) Review and merge pull requests. If you need decline current release flow on review step, you can manually run workflow 
[Release :: Clean up (dispatch)](/.github/workflows/_dispatch_cleanup-release-evnironment.yml) which will remove previously
created `release/vX.X.X` branch, tag and related pull requests. 
3) Push action into `main` branch triggers workflow run [Release :: Create](/.github/workflows/create-release.yml). This 
workflow:
   - extracts release notes from `CHANGELOG.md` for current release;
   - creates new release;
4) Manually remove redundant `release/vX.X.X` branch if it's necessary.

**IMPORTANT**: Workflows `.github/workflows/_dispatch_prepare-release.yml` and `.github/workflows/_dispatch_cleanup-release-evnironment.yml`
have `workflow_dispatch` trigger event. It means that any changes to these files requires to push changes to default
branch first (e.g. `develop` branch) to take effect. This concerns all github-scripts which are used in such workflow.
More details - [here](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)

As alternative (not recommended), you can use such flow:
1) Update application version and generate changelog locally with CLI command `yarn release` (look into library 
[documentation](https://github.com/conventional-changelog/standard-version#cli-usage) for more details how to specify 
additional parameters);
2) Create tag for new release;
3) Push updated `package.json`, `CHANGELOG.md` and new tag into `develop` and `main` branch.
4) Push action into `main` branch triggers workflow run [Release :: Create](/.github/workflows/create-release.yml).

---

### Changelog generation and version bumping rules
We use CLI tool [standard-version](https://github.com/conventional-changelog/standard-version) for automatic generation
of the changelog and changing application version in `package.json` file. 

Changelog contains only commits with conventional messages. Each new release collects commits since the last release. 
You can configure changelog sections titles and visibility in config file [./.versionrc](/.versionrc). Please refer to 
the [conventional-changelog-config-spec](https://github.com/conventional-changelog/conventional-changelog-config-spec/) 
for details on available configuration options.

Application version can be bumped automatically accordingly Semantic Versioning rules:
  - `fix` - this correlates with PATCH in Semantic Versioning;
  - `feat` - this correlates with MINOR in Semantic Versioning;
  - `!`(BREAKING CHANGE) - this correlates with MAJOR in Semantic Versioning;
  
#### Squashed commits
If branch contains merged pull request with squashed commits, changelog will contain pull request merge commit as a single
changelog entity. Title of the PR will be used as changelog message, PR type (`feat|fix|...`) will be used for defining 
of the type of changelog entity. Such entity contains link to the closed PR and link to the merge commit.

---

### UI side version indication
Application footer contains version indicator. If application is built during CI flow, version value can have such 
options as:
1) tag of the commit which has triggered build workflow;
2) if tag is not existing but push event has been done after merge of pull request from `release/vX.X.X*` branch, 
`vX.X.X*` part will be used;
3) default fallback value is commit hash (first 7 characters).

Current logic is implemented [here](/scripts/ci/github-script-src/get-app-version-name.js) and used as GitHub Action step during application build flow.
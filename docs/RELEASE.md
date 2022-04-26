# Basilisk UI releases convention

Basilisk-UI releases comply with [Semantic Versioning](https://semver.org/). 
Each release has it's own release notes, which are extracted from CHANGELOG.md. 
Changelog is based on [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/).

### New release creation flow
Creation of new release flow contains manual and automated by GitHub Actions steps. For creation of a new release:
1) Manually run workflow [Release :: Prepare (dispatch)](/.github/workflows/_dispatch_prepare-release.yml).
This workflow:
   - updates application version in `package.json` regarding provided parameters (look to the comments inside workflow file);
   - generates changelog accordingly of conventional commit messages;
   - create tag for a new release;
   - creates branch for a new release (`release/vX.X.X`);
   - creates pull requests `develop <- release/vX.X.X` and `main <- release/vX.X.X`.
2) Review and merge pull requests.
3) Push action into `main` branch triggers workflow run [Release :: Create](/.github/workflows/create-release.yml). This 
workflow:
   - extracts release notes from `CHANGELOG.md` for current release;
   - creates new release;
4) Manually remove redundant `release/vX.X.X` branch if it's necessary.

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
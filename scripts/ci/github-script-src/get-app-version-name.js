const apiUtils = require('./utils/github-api');

/**
 * Returns application version name as commit hash or triggered commit tag or
 * release version. If commit which has triggered this action run has any tag,
 * this tag will be returned. If tag is not existing but push event has been
 * done after merge of pull request from "release/vX.X.X*" branch, "vX.X.X*"
 * part will be returned as an application version.
 * Default fallback value is commit hash (first 7 characters).
 *
 * @param github
 * @param context
 * @returns {Promise<string|*>}
 */
module.exports = async ({ github, context }) => {
  const { GITHUB_SHA } = process.env;
  const [owner, repo] = context.payload.repository.full_name.split('/');
  const commitShaDecorated = GITHUB_SHA.replaceAll('::7', '').slice(0, 7);

  const tagsListResp = await github.rest.repos.listTags({
    owner,
    repo,
  });

  const commitTag = tagsListResp.data.find(
    (tagItem) => tagItem.commit.sha === GITHUB_SHA
  );

  if (commitTag) return commitTag.name || commitShaDecorated;

  const sourcePr = await apiUtils.getPullRequest(
    github,
    owner,
    repo,
    GITHUB_SHA,
    'open'
  );

  if (!sourcePr) return commitShaDecorated;

  if (!sourcePr.head_ref.startsWith('release/')) return commitShaDecorated;

  return sourcePr.head_ref.replace('release/', '') || commitShaDecorated;
};

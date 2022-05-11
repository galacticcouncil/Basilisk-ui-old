const apiUtils = require('./utils/github-api');

/**
 * Check, if pull request head branch name starts from requested substring.
 *
 * @param github
 * @param context
 * @returns {Promise<string>}
 */
module.exports = async ({ github, context }) => {
  const { GITHUB_SHA, MATCH_BRANCH_NAME = 'release' } = process.env;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  const sourcePr = await apiUtils.getMergedPullRequest(
    github,
    owner,
    repo,
    GITHUB_SHA
  );

  if (!sourcePr) return 'false';
  if (sourcePr.head_ref.startsWith(MATCH_BRANCH_NAME)) return 'true';
  return 'false'
};

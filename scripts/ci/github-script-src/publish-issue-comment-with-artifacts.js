const commentUtils = require('./utils/comment-utils');

function getArtifactUrl(repoHtmlUrl, checkSuiteNumber, artifactId) {
  return `${repoHtmlUrl}/suites/${checkSuiteNumber}/artifacts/${artifactId.toString()}`;
}

module.exports = async ({ github, context, core }) => {
  const { ISSUE_COMMENT_DATA = '{}' } = process.env;

  console.log('[LOG]:: context - ', context);

  console.log(JSON.parse(ISSUE_COMMENT_DATA));

  let {
    owner,
    repo,
    runId,
    issueNumber,
    suiteId,
    repoUrl,
    existingIssueCommentId,
    commentBody,
  } = JSON.parse(ISSUE_COMMENT_DATA);

  if (!owner || !repo || !runId) return;

  const iterator = github.paginate.iterator(
    github.rest.actions.listWorkflowRunArtifacts,
    {
      owner,
      repo,
      run_id: runId,
      per_page: 100,
    }
  );

  commentBody += `:small_blue_diamond: **Available artifacts:** <br />`;

  for await (const { data: artifacts } of iterator) {
    console.log('[LOG]:: Artifacts - ', artifacts);
    for (const artifact of artifacts) {
      commentBody += `- [${artifact.name}](${getArtifactUrl(
        repoUrl,
        suiteId,
        artifact.id
      )}) <br />`;
    }
  }

  await commentUtils.publishIssueComment({
    github,
    owner,
    repo,
    issueNumber,
    existingIssueCommentId,
    commentBody,
  });
};

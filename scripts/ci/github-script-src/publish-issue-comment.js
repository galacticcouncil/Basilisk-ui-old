const commentUtils = require('./utils/comment-utils');

module.exports = async ({ github, context, core }) => {
  const {
    REPORT_MSG_TITLE = 'Basilisk-UI workflows reporter',
    PUBLISH_ARTIFACTS_WORKFLOW_DISPATCH_FILE,
    PUBLISH_ARTIFACTS_LIST,
    IS_APP_STORYBOOK_BUILD_REPORT,
    IS_APP_UNIT_TEST_REPORT,
    IS_APP_E2E_TEST_REPORT,
    IS_STORYBOOK_UNIT_TEST_REPORT,
    IS_STORYBOOK_E2E_TEST_REPORT,
    IS_APP_STORYBOOK_DEPLOYMENT_REPORT,

    APP_UNIT_TEST_PERCENTAGE,
    APP_UNIT_TEST_DIFF,

    APP_STORYBOOK_BUILD_STATUS,
    APP_UNIT_TEST_STATUS,
    APP_STORYBOOK_DEPLOYMENT_STATUS,

    GITHUB_HEAD_REF,
    GITHUB_REF_NAME,
    GITHUB_SHA,
    GITHUB_REF,
    GITHUB_BASE_REF, // for PR target branch

    GH_PAGES_CUSTOM_DOMAIN,
    GH_TOKEN,
  } = process.env;

  process.env.GITHUB_TOKEN = GH_TOKEN;

  console.log('[LOG]:: context - ', context);

  const [owner, repo] = context.payload.repository.full_name.split('/');
  const currentBranchName =
    context.eventName === 'pull_request' ? GITHUB_HEAD_REF : GITHUB_REF_NAME;
  let triggerCommit = null;

  let commentBody = `:page_with_curl: **${REPORT_MSG_TITLE}** <br />`;

  if (context.payload.after) {
    triggerCommit = await github.rest.git.getCommit({
      owner,
      repo,
      commit_sha: context.payload.after,
    });
    commentBody += ` _Report has been triggered by commit [${triggerCommit.data.message} (${triggerCommit.data.sha})](${triggerCommit.data.html_url})_ `;
  }
  commentBody += `<br /><br />`;

  if (IS_APP_STORYBOOK_BUILD_REPORT === 'true') {
    commentBody += `:small_blue_diamond: **Application/Storybook build:** <br /> 
    - Status: ${
      APP_STORYBOOK_BUILD_STATUS === 'true'
        ? ':white_check_mark: _Built_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  if (IS_APP_STORYBOOK_DEPLOYMENT_REPORT === 'true') {
    commentBody += `<br /><br />`;
    commentBody += `:small_blue_diamond: **Application/Storybook deployment:** <br /> 
    - Status: ${
      APP_STORYBOOK_DEPLOYMENT_STATUS === 'true'
        ? ':white_check_mark: _Deployed_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  if (
    IS_APP_STORYBOOK_DEPLOYMENT_REPORT === 'true' &&
    APP_STORYBOOK_DEPLOYMENT_STATUS === 'true'
  ) {
    commentBody += `
    <br />
    - [Application build page](https://${GH_PAGES_CUSTOM_DOMAIN}/${currentBranchName}/app) <br />
    - [Storybook build page](https://${GH_PAGES_CUSTOM_DOMAIN}/${currentBranchName}/storybook)
    `;
    commentBody += `<br /><br />`;
  }

  commentBody = commentBody.replace(/(\r\n|\n|\r)/gm, '');

  let existingIssueComment = null;
  let suiteId = '';
  let issueNumber = null;

  if (context.eventName === 'pull_request') {
    existingIssueComment = await commentUtils.findIssueComment({
      github,
      context,
      issueNumber: context.payload.number,
      bodyIncludes: REPORT_MSG_TITLE,
    });

    issueNumber = context.payload.number;
  } else if (context.eventName === 'push') {
    const prList = await github.request(
      `GET /repos/${owner}/${repo}/commits/${context.sha}/pulls`,
      {
        owner,
        repo,
        commit_sha: context.sha,
      }
    );
    console.log('[LOG]:: prList - ', prList);
    const relatedPr = prList.data.filter((prItem) => prItem.state === 'open');

    issueNumber = relatedPr.length > 0 ? relatedPr[0].number : null;

    existingIssueComment = issueNumber
      ? await commentUtils.findIssueComment({
          github,
          context,
          issueNumber,
          bodyIncludes: REPORT_MSG_TITLE,
        })
      : null;
  }

  const existingIssueCommentId = existingIssueComment
    ? existingIssueComment.id
    : null;

  if (!issueNumber) return 0;

  if (PUBLISH_ARTIFACTS_LIST !== 'true') {
    await commentUtils.publishIssueComment({
      github,
      owner,
      repo,
      existingIssueCommentId,
      commentBody,
      issueNumber,
    });

    return 0;
  }

  const suitesList = await github.request(
    `GET /repos/${owner}/${repo}/commits/${GITHUB_SHA}/check-suites`,
    {
      owner,
      repo,
      ref: GITHUB_SHA,
    }
  );

  console.log('[LOG]:: suitesList - ', suitesList);

  for (let suiteItem of suitesList.data.check_suites.filter(
    (item) => item.status === 'in_progress'
  )) {
    console.log('[LOG]:: suiteItem - ', suiteItem);
    suiteId = suiteItem.id;
  }

  // Run workflow for fetching and publication artifacts list

  const preparedInputs = JSON.stringify({
    publishArtifactsList: PUBLISH_ARTIFACTS_LIST,
    repoUrl: context.payload.repository.html_url,
    runId: context.runId,
    commentBody,
    owner,
    repo,
    suiteId,
    existingIssueCommentId,
    issueNumber,
  });

  const workflowsList = await github.request(
    `GET /repos/${owner}/${repo}/actions/workflows`,
    {
      owner,
      repo,
    }
  );

  const publishArtifactsWf =
    workflowsList.data && workflowsList.data.total_count > 0
      ? workflowsList.data.workflows.find(
          (item) =>
            item.path ===
            `.github/workflows/${PUBLISH_ARTIFACTS_WORKFLOW_DISPATCH_FILE}`
        )
      : null;

  console.log('[LOG]:: publishArtifactsWf - ', publishArtifactsWf);

  if (!publishArtifactsWf) return 0;

  const dispatchResp = await github.rest.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id: publishArtifactsWf.id,
    ref: context.payload.repository.default_branch,
    inputs: {
      issue_comment_data: preparedInputs,
    },
  });

  console.log('[LOG]:: dispatchResp - ', dispatchResp);

  return 0;
};

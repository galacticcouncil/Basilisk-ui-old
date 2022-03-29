const commentUtils = require('./github-api');
const {
  commentDataKeys,
  reportMsgDefaultTitle,
  artifactsFilters,
} = require('./variables');

/**
 * Prepare metadata for issue comment, which will be used in current
 * and the next workflows vai actions cache.
 * @param github
 * @param context
 * @param env
 * @param cachedCommentMeta
 * @returns {Promise<{
 *    owner: string,
 *    repoUrl: string,
 *    existingIssueComment: (any|null),
 *    repo: string,
 *    defaultBranch: string,
 *    issueNumber: null,
 *    publishArtifactsList: boolean,
 *    branchName: string,
 *    runsList: any[],
 *    publishArtifactsWorkflowDispatchFile: string,
 *    ghPagesCustomDomain: string,
 *    reportMessageTitle: string,
 *    triggerCommit: null,
 *    runIdCurrent: number
 * }>}
 */
async function getCommentDataMetadata({
  github,
  context,
  env,
  cachedCommentMeta,
}) {
  const {
    GITHUB_HEAD_REF,
    GITHUB_REF_NAME,
    REPORT_MSG_TITLE,
    GITHUB_SHA,
    GH_PAGES_CUSTOM_DOMAIN,
    PUBLISH_ARTIFACTS_WORKFLOW_DISPATCH_FILE,
    PUBLISH_ARTIFACTS_LIST,
  } = env;
  const [owner, repo] = context.payload.repository.full_name.split('/');
  const branchName =
    context.eventName === 'pull_request' ? GITHUB_HEAD_REF : GITHUB_REF_NAME;
  let commentMetaData = {};

  commentMetaData = {
    owner,
    repo,
    branchName,
    defaultBranch: context.payload.repository.default_branch,
    ghPagesCustomDomain: GH_PAGES_CUSTOM_DOMAIN,
    repoUrl: context.payload.repository.html_url,
    runIdCurrent: context.runId,
    runsList: [],
    triggerCommit: null,
    existingIssueComment: cachedCommentMeta
      ? cachedCommentMeta.existingIssueComment
      : null,
    // suiteIdsList: [],
    issueNumber: null,
    reportMessageTitle:
      !REPORT_MSG_TITLE || REPORT_MSG_TITLE.length === 0
        ? reportMsgDefaultTitle
        : REPORT_MSG_TITLE,
    publishArtifactsList: PUBLISH_ARTIFACTS_LIST === 'true',
    publishArtifactsWorkflowDispatchFile:
      PUBLISH_ARTIFACTS_WORKFLOW_DISPATCH_FILE,
  };

  /**
   * Migrate runsList from previous runs.
   */
  if (
    cachedCommentMeta &&
    cachedCommentMeta.runsList &&
    Array.isArray(cachedCommentMeta.runsList)
  ) {
    commentMetaData.runsList = cachedCommentMeta.runsList;
  }

  /**
   * Get triggered commit SHA
   */
  if (context.payload.after) {
    try {
      const triggerCommitResp = await github.rest.git.getCommit({
        owner,
        repo,
        commit_sha: context.payload.after,
      });
      commentMetaData.triggerCommit = triggerCommitResp.data;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Fetch "existingIssueComment", "issueNumber"
   */
  if (context.eventName === 'pull_request') {
    try {
      commentMetaData.existingIssueComment =
        await commentUtils.findIssueComment({
          github,
          context,
          issueNumber: context.payload.number,
          bodyIncludes: REPORT_MSG_TITLE,
        });
    } catch (e) {
      console.log(e);
    }

    commentMetaData.issueNumber = context.payload.number;
  } else if (context.eventName === 'push') {
    const pullRequestsList = await github.request(
      `GET /repos/${owner}/${repo}/commits/${context.sha}/pulls`,
      {
        owner,
        repo,
        commit_sha: context.sha,
      }
    );
    console.log('[LOG]:: prList - ', pullRequestsList);
    const relatedPr = pullRequestsList.data.filter(
      (prItem) => prItem.state === 'open'
    );

    commentMetaData.issueNumber =
      relatedPr.length > 0 ? relatedPr[0].number : null;

    commentMetaData.existingIssueComment = commentMetaData.issueNumber
      ? await commentUtils.findIssueComment({
          github,
          context,
          issueNumber: commentMetaData.issueNumber,
          bodyIncludes: REPORT_MSG_TITLE,
        })
      : null;
  }

  if (!commentMetaData.issueNumber) return commentMetaData;

  /**
   * Get Suit ID
   */

  let currentSuitId = null;
  const suitesList = await github.request(
    `GET /repos/${owner}/${repo}/commits/${GITHUB_SHA}/check-suites`,
    {
      owner,
      repo,
      ref: GITHUB_SHA,
    }
  );

  for (let suiteItem of suitesList.data.check_suites.filter(
    (item) => item.status === 'in_progress' && item.head_branch === branchName
  )) {
    console.log('[LOG]:: suiteItem - ', suiteItem);
    currentSuitId = suiteItem.id;
  }

  commentMetaData.runsList.push({
    runId: context.runId,
    suiteId: currentSuitId,
  });

  return commentMetaData;
}

/**
 * Prepare scope of comment data for comment publication process and passing
 * prepared data to the next workflows via actions cache (actions/cache@v2).
 *
 * If "COMMENT_CACHED_CONTENT" is existing, "commentMeta" data will be updated.
 * Existing sections in "commentSections" block will be updated (if it's
 * necessary - e.g. if IS_APP_STORYBOOK_BUILD_REPORT === 'true' so section
 * "appStorybookBuild" will be updated).
 *
 * If "COMMENT_CACHED_CONTENT" is not passed from cache, comment metadata and
 * comment content sections will be prepared regarding passed config variables.
 *
 * @param github
 * @param context
 * @param env
 * @returns {Promise<any>}
 */
async function processCommentData({ github, context, env }) {
  const {
    COMMENT_CACHED_CONTENT,
    IS_APP_STORYBOOK_BUILD_REPORT,
    APP_STORYBOOK_BUILD_STATUS,

    IS_APP_STORYBOOK_DEPLOYMENT_REPORT,
    APP_STORYBOOK_DEPLOYMENT_STATUS,

    IS_APP_E2E_TEST_REPORT,
    APP_E2E_TEST_STATUS,

    IS_APP_UNIT_TEST_REPORT,
    APP_UNIT_TEST_STATUS,
    APP_UNIT_TEST_PERCENTAGE,
    APP_UNIT_TEST_DIFF,
  } = env;
  let commentData = {};

  if (COMMENT_CACHED_CONTENT !== 'false') {
    try {
      commentData =
        typeof COMMENT_CACHED_CONTENT === 'string'
          ? JSON.parse(COMMENT_CACHED_CONTENT)
          : COMMENT_CACHED_CONTENT;
    } catch (e) {
      console.log(e);
    }
  }

  commentData.commentMeta = await getCommentDataMetadata({
    github,
    context,
    env,
    cachedCommentMeta: commentData.commentMeta,
  });

  if (!commentData.commentSections) commentData.commentSections = {};

  /**
   * IS_APP_STORYBOOK_BUILD_REPORT
   */
  if (IS_APP_STORYBOOK_BUILD_REPORT === 'true') {
    if (
      COMMENT_CACHED_CONTENT.hasOwnProperty(commentDataKeys.appStorybookBuild)
    ) {
      commentData.commentSections[commentDataKeys.appStorybookBuild] = {
        ...commentData.commentSections[commentDataKeys.appStorybookBuild],
      };
    }

    if (!commentData.commentSections[commentDataKeys.appStorybookBuild])
      commentData.commentSections[commentDataKeys.appStorybookBuild] = {};

    commentData.commentSections[commentDataKeys.appStorybookBuild].status =
      APP_STORYBOOK_BUILD_STATUS === 'true';
  }

  /**
   * IS_APP_STORYBOOK_DEPLOYMENT_REPORT
   */
  if (IS_APP_STORYBOOK_DEPLOYMENT_REPORT === 'true') {
    if (
      COMMENT_CACHED_CONTENT.hasOwnProperty(
        commentDataKeys.appStorybookDeployGhPages
      )
    ) {
      commentData.commentSections[commentDataKeys.appStorybookDeployGhPages] = {
        ...commentData.commentSections[
          commentDataKeys.appStorybookDeployGhPages
        ],
      };
    }

    if (!commentData.commentSections[commentDataKeys.appStorybookDeployGhPages])
      commentData.commentSections[commentDataKeys.appStorybookDeployGhPages] =
        {};

    commentData.commentSections[
      commentDataKeys.appStorybookDeployGhPages
    ].status = APP_STORYBOOK_DEPLOYMENT_STATUS === 'true';
  }

  /**
   * IS_APP_E2E_TEST_REPORT
   */
  if (IS_APP_E2E_TEST_REPORT === 'true') {
    if (
      COMMENT_CACHED_CONTENT.hasOwnProperty(commentDataKeys.appEndToEndTests)
    ) {
      commentData.commentSections[commentDataKeys.appEndToEndTests] = {
        ...commentData.commentSections[commentDataKeys.appEndToEndTests],
      };
    }

    if (!commentData.commentSections[commentDataKeys.appEndToEndTests])
      commentData.commentSections[commentDataKeys.appEndToEndTests] = {};

    commentData.commentSections[commentDataKeys.appEndToEndTests].status =
      APP_E2E_TEST_STATUS === 'true';
  }

  /**
   * IS_APP_UNIT_TEST_REPORT
   */
  if (IS_APP_UNIT_TEST_REPORT === 'true') {
    if (COMMENT_CACHED_CONTENT.hasOwnProperty(commentDataKeys.appUnitTests)) {
      commentData.commentSections[commentDataKeys.appUnitTests] = {
        ...commentData.commentSections[commentDataKeys.appUnitTests],
      };
    }

    if (!commentData.commentSections[commentDataKeys.appUnitTests])
      commentData.commentSections[commentDataKeys.appUnitTests] = {};

    commentData.commentSections[commentDataKeys.appUnitTests].status =
      APP_UNIT_TEST_STATUS === 'true';
    commentData.commentSections[commentDataKeys.appUnitTests].percentage =
      APP_UNIT_TEST_PERCENTAGE;
    commentData.commentSections[commentDataKeys.appUnitTests].diff =
      APP_UNIT_TEST_DIFF;
  }

  return commentData;
}

/**
 * Compile markdown body for issue comment from prepared or passed comment data.
 *
 * @param github
 * @param context
 * @param commentData
 * @returns {string}
 */
function getCommentMarkdownBody({ github, context, commentData = {} }) {
  const {
    commentMeta = {},
    commentSections = {},
    availableArtifacts = [],
  } = commentData;
  let commentMarkdownBody = '';
  const commentSectionsList = Object.keys(commentSections);

  commentMarkdownBody = `:page_with_curl: **${commentMeta.reportMessageTitle}** <br />`;

  if (commentMeta.triggerCommit) {
    commentMarkdownBody += ` _Report has been triggered by commit [${commentMeta.triggerCommit.message} (${commentMeta.triggerCommit.sha})](${commentMeta.triggerCommit.html_url})_ `;
  }

  /**
   * App Storybook Build
   */
  if (commentSectionsList.includes(commentDataKeys.appStorybookBuild)) {
    commentMarkdownBody += `<hr />`;
    commentMarkdownBody += `:small_blue_diamond: **App/Storybook build:** <br />
    - Status: ${
      commentSections[commentDataKeys.appStorybookBuild].status
        ? ':white_check_mark: _Built_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  /**
   * App Storybook Deploy
   */

  if (commentSectionsList.includes(commentDataKeys.appStorybookDeployGhPages)) {
    commentMarkdownBody += `<hr />`;
    commentMarkdownBody += `:small_blue_diamond: **App/Storybook deployment:** <br />
    - Status: ${
      commentSections[commentDataKeys.appStorybookDeployGhPages].status
        ? ':white_check_mark: _Deployed_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  if (
    commentSectionsList.includes(commentDataKeys.appStorybookDeployGhPages) &&
    commentSections[commentDataKeys.appStorybookDeployGhPages].status
  ) {
    commentMarkdownBody += `
    <br />
    - [Application build page](https://${commentMeta.ghPagesCustomDomain}/${commentMeta.branchName}/app) <br />
    - [Storybook build page](https://${commentMeta.ghPagesCustomDomain}/${commentMeta.branchName}/storybook)
    `;
  }

  /**
   * App E2E Tests
   */
  if (commentSectionsList.includes(commentDataKeys.appEndToEndTests)) {
    commentMarkdownBody += `<hr />`;
    commentMarkdownBody += `:small_blue_diamond: **App E2E tests:** <br />
    - Status: ${
      commentSections[commentDataKeys.appEndToEndTests].status
        ? ':white_check_mark: _Passed_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  /**
   * App Unit Tests
   */
  if (commentSectionsList.includes(commentDataKeys.appUnitTests)) {
    commentMarkdownBody += `<hr />`;
    commentMarkdownBody += `:small_blue_diamond: **App Unit tests:** <br />
    - Status: ${
      commentSections[commentDataKeys.appUnitTests].status
        ? ':white_check_mark: _Passed_ '
        : ':no_entry_sign: _Failed_ '
    }<br />
    - Tests coverage: ${commentSections[commentDataKeys.appUnitTests].percentage}%
    `;
  }

  /**
   * Artifacts list
   */

  if (commentMeta.publishArtifactsList) {
    const filteredArtifactsList = availableArtifacts.filter(
      (artifactItem) =>
        !artifactItem.name.startsWith(artifactsFilters.excludeFromListingPrefix)
    );

    if (filteredArtifactsList.length > 0) {
      commentMarkdownBody += `<hr />`;
      commentMarkdownBody += `:small_blue_diamond: **Available artifacts:** <br />`;

      const showArtifactsNotice = !!filteredArtifactsList.find(
        (item) => !item.suiteId
      );

      if (showArtifactsNotice) {
        commentMarkdownBody +=
          "<br /><details><summary>**_Artifacts list notice!_**</summary>_This list doesn't contain links at the moment " +
          'because it has been generated on `pull_request:open` event where ' +
          '`suite_id` (required part of artifact download link) is not available. ' +
          'After the next commit into this Pull Request artifacts list will contain links._</details>';
      }

      for (const artifactItem of filteredArtifactsList) {
        if (artifactItem.suiteId) {
          commentMarkdownBody += `- [${artifactItem.name}](${artifactItem.download_url}) <br />`;
        } else {
          commentMarkdownBody += `- ${artifactItem.name} <br />`;
        }
      }
    }
  }

  commentMarkdownBody = commentMarkdownBody.replace(/(\r\n|\n|\r)/gm, '');

  return commentMarkdownBody;
}

/**
 * Create `workflow_dispatch` event via GitHub API for workflow for fetch and
 * publish available run artifacts.
 *
 * @param github
 * @param commentData
 * @returns {Promise<number>}
 */
async function runPublishArtifactsWorkflow({ github, commentData }) {
  const { commentMeta } = commentData;
  const preparedInputs = JSON.stringify(commentData);

  const workflowsList = await github.request(
    `GET /repos/${commentMeta.owner}/${commentMeta.repo}/actions/workflows`,
    {
      owner: commentMeta.owner,
      repo: commentMeta.repo,
    }
  );

  const publishArtifactsWf =
    workflowsList.data && workflowsList.data.total_count > 0
      ? workflowsList.data.workflows.find(
          (item) =>
            item.path ===
            `.github/workflows/${commentMeta.publishArtifactsWorkflowDispatchFile}`
        )
      : null;

  console.log('[LOG]:: publishArtifactsWf - ', publishArtifactsWf);

  if (!publishArtifactsWf) return 1;

  const dispatchResp = await github.rest.actions.createWorkflowDispatch({
    owner: commentMeta.owner,
    repo: commentMeta.repo,
    workflow_id: publishArtifactsWf.id,
    ref: commentMeta.defaultBranch,
    inputs: {
      issue_comment_data: preparedInputs,
    },
  });

  console.log('[LOG]:: dispatchResp - ', dispatchResp);

  return 0;
}

/**
 * Compile URL for downloading run artifact.
 *
 * @param repoHtmlUrl
 * @param checkSuiteNumber
 * @param artifactId
 * @returns {string}
 */
function getArtifactUrl(repoHtmlUrl, checkSuiteNumber, artifactId) {
  return `${repoHtmlUrl}/suites/${checkSuiteNumber}/artifacts/${artifactId.toString()}`;
}

/**
 * Fetch available artifacts in particular workflow run.
 *
 * @param github
 * @param commentMeta
 * @returns {Promise<*[]>}
 */
async function getRunArtifactsList({ github, commentMeta }) {
  const { owner, repo, runsList, repoUrl } = commentMeta;

  const artifactsScope = await Promise.all(
    runsList.map(async (runItem) => {
      const runArtifactsList = [];

      const iterator = github.paginate.iterator(
        github.rest.actions.listWorkflowRunArtifacts,
        {
          owner,
          repo,
          run_id: runItem.runId,
          per_page: 100,
        }
      );

      for await (const { data: artifacts } of iterator) {
        console.log('[LOG]:: Artifacts - ', artifacts);
        for (const artifact of artifacts) {
          runArtifactsList.push({
            ...artifact,
            download_url: getArtifactUrl(repoUrl, runItem.suiteId, artifact.id),
            suiteId: runItem.suiteId,
            runId: runItem.runId,
          });
        }
      }

      return runArtifactsList;
    })
  );

  return artifactsScope.filter((item) => !!item).flat();
}

module.exports = {
  getCommentMarkdownBody,
  processCommentData,
  runPublishArtifactsWorkflow,
  getRunArtifactsList,
};

const getComment = require('./_find-issue-comment');

module.exports = async ({ github, context, core }) => {
  const {
    SHA,
    IS_APP_SB_BUILD_REPORT,
    IS_APP_SB_DEPLOYMENT_REPORT,
    IS_APP_UNIT_TEST_REPORT,
    IS_APP_E2E_TEST_REPORT,
    IS_SB_UNIT_TEST_REPORT,
    IS_SB_E2E_TEST_REPORT,

    APP_UNIT_TEST_PERCENTAGE,
    APP_UNIT_TEST_DIFF,
    APP_BUILD_STATUS,
    APP_UNIT_TEST_REF_BRANCH,
    APP_UNIT_TEST_STATUS,
    APP_DEPLOYMENT_STATUS,
    REPORT_MSG_TITLE = 'Basilisk-UI APP/Storybook build | testing | deployment',

    GITHUB_HEAD_REF,
    GITHUB_REF,
    GITHUB_REF_NAME,
    gh_token,
  } = process.env;

  process.env.GITHUB_TOKEN = gh_token;

  // const githubActions = require('@tonyhallett/github-actions');
  //
  // console.log(
  //   'githubActions - ',
  //   await githubActions.getWorkflowArtifactDetails()
  // );

  console.log('context - ', context);
  // console.log('process.env - ', process.env);

  const commentBody = `## Basilisk-reporter message. \n :small_blue_diamond: Testing is fine! UPDATED`;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  const existingIssueComment = await getComment({
    github,
    context,
    issueNumber: context.payload.number,
    bodyIncludes: 'Basilisk-reporter message.',
  });

  await new Promise((res, rej) => {
    setTimeout(async () => {
      console.log('context.runId - ', context.runId)
      const runArtifactsList =
        await github.rest.actions.listWorkflowRunArtifacts({
          owner,
          repo,
          run_id: context.runId,
          per_page: 100,
          page: 1,
        });

      const iterator = github.paginate.iterator(github.rest.actions.listWorkflowRunArtifacts, {
        owner,
        repo,
        run_id: context.runId,
        per_page: 100,
      });

      for await (const { data: artifacts } of iterator) {
        console.log('---artifacts - ', artifacts)
        for (const artifact of artifacts) {
          console.log("artifact - ", artifact);
        }
      }

      console.log('runArtifactsList iterator - ', iterator); //1929009502

      if (!existingIssueComment) {
        github.rest.issues.createComment({
          issue_number: context.payload.number,
          owner,
          repo,
          body: commentBody,
        });
      } else {
        github.rest.issues.updateComment({
          owner,
          repo,
          comment_id: existingIssueComment.id,
          body: commentBody,
        });
      }
      res();
    }, 10000);
  });
};

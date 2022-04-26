function getAppStorybookBuildMarkdownBody({
  APP_STORYBOOK_BUILD_STATUS,
  context,
}) {
  const workingBranch = context.ref.replace('refs/heads/', '');
  const repoUrl = context.payload.repository.html_url;
  const noticeText =
    context.eventName === 'pull_request' ||
    context.eventName === 'pull_request_target'
      ? `Build in [PR#${context.payload.number}](${repoUrl}/pull/${context.payload.number}) from commit [${context.sha}](${repoUrl}/commit/${context.sha})`
      : `Build of codebase in branch [${workingBranch}](${repoUrl}/tree/${workingBranch}) from commit [${context.sha}](${repoUrl}/commit/${context.sha})`;

  const appSbBuildData = [
    {
      name: ':small_blue_diamond:  App / Storybook build',
      value: `${
        APP_STORYBOOK_BUILD_STATUS === 'true'
          ? ':white_check_mark: Built.'
          : ':no_entry_sign: Failed'
      }\n ${noticeText}`,
      inline: false,
    },
  ];
  return appSbBuildData;
}

function getAppStorybookDeploymentMarkdownBody({
  APP_STORYBOOK_DEPLOYMENT_STATUS,
  context,
}) {
  const appSbDeploymentData = [
    {
      name: ':small_blue_diamond:  App / Storybook deploy',
      value: `${
        APP_STORYBOOK_DEPLOYMENT_STATUS === 'true'
          ? ':white_check_mark:  Deployed.'
          : ':no_entry_sign:  Failed'
      }`,
      inline: false,
    },
  ];
  return appSbDeploymentData;
}

function getAppUnitTestsMarkdownBody({
  APP_UNIT_TEST_PERCENTAGE,
  APP_UNIT_TEST_DIFF,
  APP_UNIT_TEST_REF_BRANCH,
  APP_UNIT_TEST_STATUS,
  context,
}) {
  const appUnitTestsData = [
    {
      name: ':small_blue_diamond:  App Unit tests',
      value:
        APP_UNIT_TEST_STATUS === 'true'
          ? ':white_check_mark: Passed'
          : ':no_entry_sign: Failed',
      inline: false,
    },
  ];

  if (APP_UNIT_TEST_STATUS === 'true') {
    appUnitTestsData.push({
      name: 'Tests code-coverage total percentage',
      value: APP_UNIT_TEST_PERCENTAGE,
      inline: true,
    });
  }
  if (
    APP_UNIT_TEST_STATUS === 'true' &&
    (context.eventName === 'pull_request' ||
      context.eventName === 'pull_request_target')
  ) {
    appUnitTestsData.push({
      name: `Tests code-coverage diff with target branch - ${APP_UNIT_TEST_REF_BRANCH}`,
      value: APP_UNIT_TEST_DIFF,
      inline: true,
    });
  }

  return appUnitTestsData;
}

module.exports = {
  getAppStorybookBuildMarkdownBody,
  getAppStorybookDeploymentMarkdownBody,
  getAppUnitTestsMarkdownBody,
};

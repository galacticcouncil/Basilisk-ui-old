module.exports = ({
  APP_UNIT_TEST_PERCENTAGE,
  APP_UNIT_TEST_DIFF,
  APP_UNIT_TEST_REF_BRANCH,
  APP_UNIT_TEST_STATUS,
  context,
}) => {
  const appUnitTestsData = [
    {
      name: ':small_blue_diamond:  App Unit tests',
      value: APP_UNIT_TEST_STATUS === 'true'
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
};

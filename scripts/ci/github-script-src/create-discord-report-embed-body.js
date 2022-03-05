const getAppUnitTestReportData = require('./_app-unit-test-report');
const getAppSbBuildReportData = require('./_app-sb-build-report');
const getAppSbDeploymentReportData = require('./_app-sb-deployment-report');

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
  } = process.env;

  console.log('context - ', context);
  console.log('process.env - ', process.env);
  // console.log(
  //   'IS_APP_SB_BUILD_REPORT typeof - ',
  //   typeof IS_APP_SB_BUILD_REPORT
  // );

  const embedBody = {
    title: REPORT_MSG_TITLE,
    description: `Check workflow execution results and artifacts [here](${context.payload.repository.html_url}/actions/runs/${context.runId})`,
    color:
      APP_BUILD_STATUS === 'true' &&
      APP_UNIT_TEST_STATUS === 'true' &&
      APP_DEPLOYMENT_STATUS === 'true'
        ? '65280'
        : '16711680',
    fields: [],
  };

  if (IS_APP_SB_BUILD_REPORT === 'true') {
    embedBody.fields.push(
      ...getAppSbBuildReportData({
        APP_BUILD_STATUS,
        context,
      })
    );
  }

  if (IS_APP_UNIT_TEST_REPORT === 'true') {
    embedBody.fields.push(
      ...getAppUnitTestReportData({
        APP_UNIT_TEST_PERCENTAGE,
        APP_UNIT_TEST_DIFF,
        APP_UNIT_TEST_REF_BRANCH,
        APP_UNIT_TEST_STATUS,
        context,
      })
    );
  }

  if (IS_APP_SB_DEPLOYMENT_REPORT === 'true') {
    embedBody.fields.push(
      ...getAppSbDeploymentReportData({
        APP_DEPLOYMENT_STATUS,
        context,
      })
    );
  }

  return JSON.stringify([embedBody]);
};

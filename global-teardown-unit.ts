const exec = require('child_process').execSync;
async function globalSetup() {
  await exec('npx xunit-viewer -r ui-app-unit-tests-results.xml -o ui-app-unit-tests-results.html');
}
export default globalSetup;

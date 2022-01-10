const exec = require('child_process').execSync;
async function globalSetup() {
  await exec('npx xunit-viewer -r  ui-app-e2e-results.xml -o ui-app-e2e-results.html');
}
export default globalSetup;

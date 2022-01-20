const exec = require('child_process').execSync;
async function makeReport() {
  await exec('npx xunit-viewer -r  storybook-testing/results/storybook-testing-results.xml -o storybook-testing/results/storybook-testing-results.html');
}
export default makeReport;

const exec = require('child_process').execSync;
const fs = require('fs');

async function globalSetup() {

  try {
    if (fs.existsSync('ui-app-unit-tests-results.xml')) {
      await exec(
        'npx xunit-viewer -r ui-app-unit-tests-results.xml -o ui-app-unit-tests-results.html'
      );
    }
  } catch(err) {
    console.error(err)
  }

  try {
    if (fs.existsSync('ui-app-e2e-results.xml')) {
      await exec(
        'npx xunit-viewer -r ui-app-e2e-results.xml -o ui-app-e2e-results.html'
      );
    }
  } catch(err) {
    console.error(err)
  }

  try {
    if (fs.existsSync('storybook-testing/results/storybook-testing-results.xml')) {
      await exec(
        'npx xunit-viewer -r storybook-testing/results/storybook-testing-results.xml -o storybook-testing/results/storybook-testing-results.html'
      );
    }
  } catch(err) {
    console.error(err)
  }
}

export default globalSetup;

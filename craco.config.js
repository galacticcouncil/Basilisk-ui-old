module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // support for wasm
      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: 'webassembly/sync',
      });

      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        syncWebAssembly: true
      }

      return webpackConfig;
    }
  },
  jest: {
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      return {
        ...jestConfig,
        globalTeardown: require.resolve(rootDir + '/global-teardown-unit.ts'),
        reporters: [
          'default',
          ['jest-junit', { outputFile: 'ui-app-unit-tests-results.xml' }],
        ],
        // testResultsProcessor:
      };
    },
  },
};

// module.exports = {}
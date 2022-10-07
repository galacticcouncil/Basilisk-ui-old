module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // support for wasm

      webpackConfig.resolve.extensions.push('.wasm')

      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify')
      }

      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: 'webassembly/sync'
      })

      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        syncWebAssembly: true,
        topLevelAwait: true
      }

      return webpackConfig
    }
  },
  jest: {
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      return {
        ...jestConfig,
        globalTeardown: require.resolve(rootDir + '/global-teardown.ts'),
        reporters: [
          'default',
          ['jest-junit', { outputFile: 'ui-app-unit-tests-results.xml' }]
        ],
        collectCoverage: true,
        collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**'],
        // "coverageThreshold": {
        //   "global": {
        //     "lines": 90
        //   }
        // },
        coverageReporters: ['text', 'lcov'],
        testPathIgnorePatterns: ['./*.stories.test.ts$'],
        transformIgnorePatterns: ['node_modules/(?!@polkadot)/']
        // testResultsProcessor:
      }
    }
  }
}

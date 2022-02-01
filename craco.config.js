const { addBeforeLoader, loaderByName } = require('@craco/craco');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };

      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: 'webassembly/sync',
      });

      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        syncWebAssembly: true,
      };

      // webpackConfig.module.rules.forEach((rule) => {
      //   (rule.oneOf || []).forEach((oneOf) => {
      //     if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
      //       oneOf.exclude.push(wasmExtensionRegExp);
      //     }
      //   });
      // });

      // const wasmLoader = {
      //   // loaders: ['wasm-loader'],
      //   loader: require.resolve('wasm-loader'),
      //   options: {
      //     test: /\.wasm$/,
      //     exclude: /node_modules/,
      //   },
      // };
      //
      // addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

      return webpackConfig;
    },
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

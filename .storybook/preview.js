export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'full-page',
    values: [
      {
        name: 'full-page',
        value: 'linear-gradient(107.54deg, #373741 47.92%, #424250 100%);'
      }
    ]
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
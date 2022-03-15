module.exports = ({ APP_DEPLOYMENT_STATUS, context }) => {
  const appSbDeploymentData = [
    {
      name: ':small_blue_diamond:  App / Storybook deploy',
      value: `${
        APP_DEPLOYMENT_STATUS === 'true'
          ? ':white_check_mark:  Deployed.'
          : ':no_entry_sign:  Failed'
      }`,
      inline: false,
    },
  ];
  return appSbDeploymentData;
};

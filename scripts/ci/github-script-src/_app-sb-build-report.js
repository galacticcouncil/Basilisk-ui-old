module.exports = ({ APP_BUILD_STATUS, context }) => {
  const workingBranch = context.ref.replace('refs/heads/', '');
  const repoUrl = context.payload.repository.html_url;
  const noticeText =
    context.eventName === 'pull_request' ||
    context.eventName === 'pull_request_target'
      ? `Build in [PR#${context.payload.number}](${repoUrl}/pull/${context.payload.number}) from commit [${context.sha}](${repoUrl}/commit/${context.sha})`
      : `Build of codebase in branch [${workingBranch}](${repoUrl}/tree/${workingBranch}) from commit [${context.sha}](${repoUrl}/commit/${context.sha})`;

  const appSbBuildData = [
    {
      name: ':small_blue_diamond:  App / Storybook build',
      value: `${
        APP_BUILD_STATUS === 'true'
          ? ':white_check_mark: Built.'
          : ':no_entry_sign: Failed'
      }\n ${noticeText}`,
      inline: false,
    },
  ];
  return appSbBuildData;
};

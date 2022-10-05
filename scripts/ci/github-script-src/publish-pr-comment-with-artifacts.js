const commentUtils = require('./utils/github-api')
const issueCommentComponents = require('./utils/issue-comment')

module.exports = async ({ github, context, core }) => {
  const { ISSUE_COMMENT_DATA = '{}' } = process.env

  console.log('[LOG]:: context 2 - ', context)
  console.log(JSON.parse(ISSUE_COMMENT_DATA))

  const { commentMeta, commentSections } = JSON.parse(ISSUE_COMMENT_DATA)

  if (
    !commentMeta.owner ||
    !commentMeta.repo ||
    !commentMeta.runsList ||
    commentMeta.runsList.length === 0
  )
    return

  const availableArtifacts = await issueCommentComponents.getRunArtifactsList({
    github,
    commentMeta
  })

  const commentMarkdownBody = issueCommentComponents.getCommentMarkdownBody({
    github,
    context,
    commentData: {
      commentMeta,
      commentSections,
      availableArtifacts
    }
  })

  await commentUtils.publishIssueComment({
    github,
    owner: commentMeta.owner,
    repo: commentMeta.repo,
    existingIssueCommentId: commentMeta.existingIssueComment
      ? commentMeta.existingIssueComment.id
      : null,
    commentBody: commentMarkdownBody,
    issueNumber: commentMeta.issueNumber
  })
}

function findCommentPredicate(inputs, comment) {
  return (
    (inputs.commentAuthor && comment.user
      ? comment.user.login === inputs.commentAuthor
      : true) &&
    (inputs.bodyIncludes && comment.body
      ? comment.body.includes(inputs.bodyIncludes)
      : true)
  )
}

async function publishIssueComment({
  github,
  context,
  issueNumber,
  owner,
  repo,
  commentBody,
  existingIssueCommentId
}) {
  try {
    if (
      !existingIssueCommentId ||
      existingIssueCommentId === 'null' ||
      !issueNumber
    ) {
      return await github.rest.issues.createComment({
        issue_number: issueNumber,
        owner,
        repo,
        body: commentBody
      })
    } else {
      return await github.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existingIssueCommentId,
        body: commentBody
      })
    }
  } catch (e) {
    console.log(e)
    return 1
  }
}

async function findIssueComment({
  github,
  context,
  bodyIncludes,
  issueNumber,
  commentId = null,
  commentAuthor = null
}) {
  const [owner, repo] = context.payload.repository.full_name.split('/')
  let comment = null

  if (!issueNumber || !owner || !repo) return null

  const parameters = {
    owner: owner,
    repo: repo,
    issue_number: issueNumber
  }

  if (commentId) {
    comment = await github.rest.issues.getComment({
      owner,
      repo,
      comment_id: commentId
    })

    if (comment) return comment
  }

  for await (const { data: comments } of github.paginate.iterator(
    github.rest.issues.listComments,
    parameters
  )) {
    // Search each page for the comment
    comment = comments.find((comment) =>
      findCommentPredicate({ commentAuthor, bodyIncludes }, comment)
    )
    if (comment) return comment
  }

  return null
}

module.exports = {
  publishIssueComment,
  findIssueComment
}

function findCommentPredicate(inputs, comment) {
  return (
    (inputs.commentAuthor && comment.user
      ? comment.user.login === inputs.commentAuthor
      : true) &&
    (inputs.bodyIncludes && comment.body
      ? comment.body.includes(inputs.bodyIncludes)
      : true)
  );
}

module.exports = async ({
  github,
  context,
  bodyIncludes,
  issueNumber,
  commentAuthor = null,
}) => {
  const [owner, repo] = context.payload.repository.full_name.split('/');

  const parameters = {
    owner: owner,
    repo: repo,
    issue_number: issueNumber,
  };

  for await (const { data: comments } of github.paginate.iterator(
    github.rest.issues.listComments,
    parameters
  )) {
    // Search each page for the comment
    const comment = comments.find((comment) =>
      findCommentPredicate({ commentAuthor, bodyIncludes }, comment)
    );
    if (comment) return comment;
  }

  return null;
};

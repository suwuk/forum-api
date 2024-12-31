const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, ownerId) {
    const addComment = new AddComment(useCasePayload);

    await this._threadRepository.verifyThreadAvailable(threadId);

    const addedComment = await this._commentRepository.addComment(addComment, threadId, ownerId);

    return new AddedComment({ ...addedComment });
  }
}

module.exports = AddCommentUseCase;
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailable = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
        message: 'komentar berhasil dihapus'
      }));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(ownerId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailable)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentIsExist)
      .toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(ownerId, commentId);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(commentId);
  });
});
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const CommentRepository = require(
  '../../../Domains/comments/CommentRepository',
);

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'thread-vhbdhmo803h';
    
    const mockGetThread = {
      id: 'thread-vhbdhmo803h',
      title: 'thread baru',
      body: 'thread body',
      date: '2024-10-10T07:19:09.775Z',
      username: 'dicoding',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve([mockGetThread]));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-090vgizxzxpv',
          owner: 'user-123',
          date: '2024-10-10T07:22:33.555Z',
          content: 'sebuah comment',
          is_delete: false,
          username: 'johndoe'
        }
      ]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const commentedThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(commentedThread).toStrictEqual(new GetThread(
      {
        id: 'thread-vhbdhmo803h',
        title: 'thread baru',
        body: 'thread body',
        date: '2024-10-10T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-090vgizxzxpv',
            username: 'johndoe',
            date: '2024-10-10T07:22:33.555Z',
            content: 'sebuah comment',
          },
        ],
      },
    ));
    
    // Verify all mock function calls
    expect(mockThreadRepository.getThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(threadId);
    expect(mockThreadRepository.getThread).toBeCalledTimes(1);
    expect(mockCommentRepository.getComments).toBeCalledTimes(1);
  });

  it('should orchestrating the get thread action correctly with comment and reply deleted', async () => {
    const threadId = 'thread-vhbdhmo803h';
    const commentId = 'comment-090vgizxzxpv';
    const mockGetThread = {
      id: 'thread-vhbdhmo803h',
      title: 'thread baru',
      body: 'thread body',
      date: '2024-10-10T07:19:09.775Z',
      username: 'dicoding',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve([mockGetThread]));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: commentId,
          owner: 'user-123',
          date: '2024-10-10T07:22:33.555Z',
          content: 'sebuah comment',
          is_delete: true,
          username: 'johndoe'
        }
      ]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const commentedThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(commentedThread).toStrictEqual(new GetThread(
      {
        id: 'thread-vhbdhmo803h',
        title: 'thread baru',
        body: 'thread body',
        date: '2024-10-10T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-090vgizxzxpv',
            username: 'johndoe',
            date: '2024-10-10T07:22:33.555Z',
            content: '**komentar telah dihapus**',
          },
        ],
      },
    ));

    // Verify all mock function calls
    expect(mockThreadRepository.getThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(threadId);
    expect(mockThreadRepository.getThread).toBeCalledTimes(1);
    expect(mockCommentRepository.getComments).toBeCalledTimes(1);
  });
});
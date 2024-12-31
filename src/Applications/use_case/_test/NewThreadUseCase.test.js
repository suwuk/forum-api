const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThreadUseCase = require('../NewThreadUseCase');

describe('NewThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'New Thread',
      body: 'New Thread body',
    };
    const mockAddedThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new NewThreadUseCase({ threadRepository: mockThreadRepository });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload, 'user-123');

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), 'user-123');
  });
});
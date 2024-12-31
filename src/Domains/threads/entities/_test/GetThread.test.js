const GetThread = require('../GetThread');

describe('an GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Commented Thread',
      body: 'A body thread',
      date: '2024-10-10T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-090vgizxzxpv',
          username: 'johndoe',
          date: '2024-10-10T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-2m2rzv3nrho',
          username: 'dicoding',
          date: '2024-10-10T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('COMMENTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'Commented Thread',
      body: 'A body thread',
      date: '2024-10-10T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-090vgizxzxpv',
          username: 'johndoe',
          date: '2024-10-10T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-2m2rzv3nrho',
          username: 'dicoding',
          date: '2024-10-10T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('COMMENTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentedThread object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'Commented Thread',
      body: 'A body thread',
      date: '2024-10-10T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-090vgizxzxpv',
          username: 'johndoe',
          date: '2024-10-10T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-2m2rzv3nrho',
          username: 'dicoding',
          date: '2024-10-10T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Action
    const commentedThread = new GetThread(payload);

    // Assert
    expect(commentedThread.id).toEqual(payload.id);
    expect(commentedThread.title).toEqual(payload.title);
    expect(commentedThread.body).toEqual(payload.body);
    expect(commentedThread.date).toEqual(payload.date);
    expect(commentedThread.username).toEqual(payload.username);
    expect(commentedThread.comments).toEqual(payload.comments);
  });
});
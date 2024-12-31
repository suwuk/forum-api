const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload dit not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'judul thread',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 123,
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 100 character', () => {
    // Arrange
    const payload = {
      title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      body: 'Body content',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Valid Thread Title',
      body: 'Valid Content Body',
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
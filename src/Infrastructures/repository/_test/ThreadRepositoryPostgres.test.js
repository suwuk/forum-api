const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      {
        id: 'user-456',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    );
  });

  afterEach(async () => {
    // await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new NewThread({
        title: 'New Thread',
        body: 'New Thread body',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread, 'user-456');

      // Assert
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'New Thread',
        owner: 'user-456'
      });

      // Verify data in database
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });
  });

  describe('getThread function', () => {
    it('should persist get thread', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      /** Add thread */
      const addThread = {
        id: 'thread-123',
        title: 'New Thread 123',
        body: 'New thread body 123.',
        owner: 'user-456',
        date: '2023-12-31T00:00:00.000Z'
      };
      await ThreadsTableTestHelper.addThread(addThread);

      // Action
      const thread = await threadRepositoryPostgres.getThread(addThread.id);
      const user = await UsersTableTestHelper.findUsersById(addThread.owner);

      // Assert
      expect(thread).toHaveLength(1);
      expect(thread[0].id).toBe(addThread.id);
      expect(thread[0].title).toBe(addThread.title);
      expect(thread[0].body).toBe(addThread.body);
      expect(thread[0].date).toBe(addThread.date);
      expect(thread[0].username).toBe(user[0].username);
    });
  });

  describe('verifyThreadAvailable function', () => {
    it('should throw error when thread not found', async () => {
      // const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const verifyThreadAvailable = async () => threadRepositoryPostgres.verifyThreadAvailable('thread-001');

      // Assert
      await expect(verifyThreadAvailable)
        .rejects
        .toThrowError(new NotFoundError('thread tidak ditemukan'));
    });

    it('should not throw error when thread found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      /** Add thread */
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'New Thread 123',
        body: 'New thread body 123.',
        owner: 'user-456',
      });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailable('thread-123'))
        .resolves
        .not
        .toThrowError(new NotFoundError('thread tidak ditemukan'));
    });
  });
});
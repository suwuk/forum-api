const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require(
  '../../../Commons/exceptions/AuthorizationError',
);

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });

    await UsersTableTestHelper.addUser({
      id: 'user-456',
      username: 'diaz',
      password: 'rahasia',
      fullname: 'Diaz Dicoding',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'New Thread 123',
      body: 'New thread body 123.',
      owner: 'user-123',
      date: new Date().toISOString(),
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentIsExist function', () => {
    it('should throw error when comment not found', async () => {
      // Arrange
      const addComment = new AddComment({ content: 'New Comment' });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment, 'thread-123', 'user-123');

      // Assert
      const verifyCommentIsExist = async () => commentRepositoryPostgres.verifyCommentIsExist('comment-456');
      await expect(verifyCommentIsExist)
        .rejects
        .toThrowError(new NotFoundError('komentar tidak ditemukan'));
    });

    it('should not throw error when comment found', async () => {
      // Arrange
      const addComment = new AddComment({ content: 'New Comment' });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment, 'thread-123', 'user-123');

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExist('comment-123'))
        .resolves
        .not
        .toThrowError(new NotFoundError('komentar tidak ditemukan'));
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw error AuthorizationError', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'New Comment from user-456',
        thread: 'thread-123',
        owner: 'user-123',
        is_delete: false,
        date: '2024-10-11T15:00:41.573Z',
      });

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-001', 'comment-123'))
        .rejects
        .toThrowError(new AuthorizationError('tidak berhak menghapus komentar'));
    });

    it('should not throw error AuthorizationError', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'New Comment from user-456',
        thread: 'thread-123',
        owner: 'user-123',
        is_delete: false,
        date: '2024-10-11T15:00:41.573Z',
      });

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123'))
        .resolves
        .not
        .toThrowError(new AuthorizationError('tidak berhak menghapus komentar'));
    });
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const expectedComment = {
        id: 'comment-456',
        content: 'New Comment',
        owner: 'user-456'
      };

      const addComment = new AddComment({ content: expectedComment.content });
      const fakeIdGenerator = () => '456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment, 'thread-123', expectedComment.owner);

      // Assert
      expect(addedComment.id).toEqual(expectedComment.id);
      expect(addedComment.content).toEqual(expectedComment.content);
      expect(addedComment.owner).toEqual(expectedComment.owner);

      // Verify data in database
      const comments = await CommentsTableTestHelper.findCommentById(expectedComment.id);
      expect(comments).toHaveLength(1);
      const [comment] = comments;
      expect(comment.id).toEqual(expectedComment.id);
      expect(comment.content).toEqual(expectedComment.content);
      expect(comment.owner).toEqual(expectedComment.owner);
      expect(comment.thread).toEqual('thread-123');
      expect(comment.is_delete).toEqual(false);
      expect(comment.date).toBeDefined();
    });
  });

  describe('deleteComment', () => {
    it('should persist delete comment and return success result', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const expectedComment = {
        id: 'comment-456',
        content: 'New Comment will be deleted',
        thread: 'thread-123',
        owner: 'user-456',
        is_delete: false,
        date: '2024-10-11T15:00:41.573Z'
      };
      await CommentsTableTestHelper.addComment({
        id: expectedComment.id,
        content: expectedComment.content,
        thread: expectedComment.thread,
        owner: expectedComment.owner,
        is_delete: expectedComment.is_delete,
        date: expectedComment.date

      });
      // Action
      const deleteResult = await commentRepositoryPostgres.deleteComment('comment-456');

      // Assert
      // Assert return value
      expect(deleteResult).toStrictEqual({
        status: 'success',
        message: 'komentar berhasil dihapus'
      });

      // Assert database state
      const commentDeleted = await CommentsTableTestHelper.findCommentById('comment-456');
      expect(commentDeleted[0].id).toEqual(expectedComment.id);
      expect(commentDeleted[0].content).toEqual(expectedComment.content);
      expect(commentDeleted[0].owner).toEqual(expectedComment.owner);
      expect(commentDeleted[0].thread).toEqual(expectedComment.thread);
      expect(commentDeleted[0].is_delete).toEqual(true);
      expect(commentDeleted[0].date).toEqual(expectedComment.date);
    });
  });

  describe('getComments function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const expectedComment = {
        id: 'comment-123',
        content: 'first comment',
        owner: 'user-123',
        date: '2023-01-01T00:00:00.000Z',
        is_delete: false,
        username: 'dicoding',
        threadId: 'thread-123'
      };

      await CommentsTableTestHelper.addComment({
        id: expectedComment.id,
        content: expectedComment.content,
        owner: expectedComment.owner,
        thread: expectedComment.threadId,
        date: expectedComment.date,
        is_delete: expectedComment.is_delete
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getComments(expectedComment.threadId);

      // Assert
      expect(comments).toHaveLength(1);
      const [comment] = comments;
      expect(comment.id).toEqual(expectedComment.id);
      expect(comment.content).toEqual(expectedComment.content);
      expect(comment.owner).toEqual(expectedComment.owner);
      expect(comment.date).toEqual(expectedComment.date);
      expect(comment.is_delete).toEqual(expectedComment.is_delete);
      expect(comment.username).toEqual(expectedComment.username);
    });

    it('should return empty array when no comments exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Action
      const comments = await commentRepositoryPostgres.getComments(threadId);

      // Assert
      expect(comments).toHaveLength(0);
      expect(comments).toEqual([]);
    });
  });
});
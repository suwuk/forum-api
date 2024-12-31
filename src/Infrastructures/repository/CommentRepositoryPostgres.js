const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require(
  '../../Commons/exceptions/AuthorizationError',
);

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getComments(threadId) {
    const query = {
      text: `SELECT c.id, c.owner, c.date, c.content, c.is_delete, u.username 
            FROM comments as c
            INNER JOIN users as u ON c.owner = u.id
            WHERE thread = $1`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async verifyCommentIsExist(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(ownerId, commentId) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('tidak berhak menghapus komentar');
    }
  }

  async addComment(addComment, threadId, owner) {
    const id = `comment-${this._idGenerator()}`;
    const { content } = addComment;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO comments(id, content, owner, thread, date) 
            VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner`,
      values: [id, content, owner, threadId, createdAt],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async deleteComment(commentId) {
    await this._pool.query({
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    });

    return {
      status: 'success',
      message: 'komentar berhasil dihapus'
    };
  }
}

module.exports = CommentRepositoryPostgres;
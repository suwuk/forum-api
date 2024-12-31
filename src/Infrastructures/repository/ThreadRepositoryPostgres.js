const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread, owner) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async verifyThreadAvailable(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username
            FROM threads as t
            INNER JOIN users as u ON t.owner = u.id
            WHERE t.id = $1`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

}

module.exports = ThreadRepositoryPostgres;
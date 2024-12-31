const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const getThread = await this._threadRepository.getThread(threadId);
    const getComments = await this._commentRepository.getComments(threadId);

    const comments = await Promise.all(getComments.map(async (comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    })));

    return new GetThread({
      id: getThread[0].id,
      title: getThread[0].title,
      body: getThread[0].body,
      date: getThread[0].date,
      username: getThread[0].username,
      comments,
    });
  }
}

module.exports = GetThreadUseCase;
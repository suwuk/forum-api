const NewThread = require('../../Domains/threads/entities/NewThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class NewThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId) {
    const addThread = new NewThread(useCasePayload);
    const addedThread = await this._threadRepository.addThread(addThread, ownerId);

    return new AddedThread({ ...addedThread });
  }
}

module.exports = NewThreadUseCase;
const faker = require('faker');

const { Note, User } = require('../src/db/models');
const { writeFilePromise } = require('../src/util/files');

module.exports = async (userId) => {
  const note = {
    name: faker.random.word(),
    data: faker.lorem.sentences(),
    userId,
  };

  const noteRecord = await Note.create(note);
  await writeFilePromise(`data/${noteRecord.id}.txt`, note.data);

  return {
    ...note,
    id: noteRecord.id,
  };
};

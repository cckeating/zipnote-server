const Sequelize = require('sequelize');
const { writeFilePromise, readFilePromise, deleteFilePromise } = require('../../util/files');
const { Note } = require('../../db/models');
const throwError = require('../../util/error');

/**
 * Note Service - Handles all things regarding notes
 *  */
module.exports = () => {
  /**
   * Creates a new Note record in the database and writes the note data to a file.
   * @param {number} userId - ID of user that note will be assigned to
   * @param {object} note - Note object containing data that will be saved
   * @returns Newly created note
   *  */
  async function create({ userId, note }) {
    const { name, data } = note;

    const noteModel = await Note.create({
      name,
      userId,
    });

    await writeFilePromise(`data/${noteModel.id}.txt`, data);

    return {
      id: noteModel.id,
      name,
    };
  }

  /**
   * Gets a note by ID that is assigned to a userId
   * @param {number} userId - ID of user
   * @param {number} noteId - ID of note to be found
   * @returns Found note
   *  */
  async function getById({ userId, noteId }) {
    const note = await Note.findOne({
      where: { id: noteId, userId },
    });

    if (!note) {
      throwError('Note not found', 404, 'Failed to find note by this ID');
    }

    const noteData = await readFilePromise(`data/${note.id}.txt`);

    return {
      ...note.toJSON(),
      data: noteData.toString(),
    };
  }

  /**
   * Gets all notes that are assigned to a user
   * @param {number} userId - ID of user that note will be assigned to
   * @param {object} query - Query object containing fields to query list on
   * @returns List of notes
   *  */
  async function getAllNotes({ userId, query }) {
    const { limit, offset, name } = query;

    const options = {
      where: {
        userId,
      },
      order: [['updatedAt', 'DESC']],
    };

    if (!Number.isNaN(+limit)) {
      options.limit = +limit;
    }
    if (!Number.isNaN(+offset)) {
      options.offset = +offset;
    }

    if (name) {
      options.where.name = { [Sequelize.Op.like]: `%${name}%` };
    }

    const notes = await Note.findAll(options);

    const total = await Note.count(options);

    return {
      notes: notes.map((note) => note.toJSON()),
      total,
    };
  }

  /**
   * Updates a note by ID that is assigned to a user
   * @param {number} userId - ID of user that note will be assigned to
   * @param {number} noteId - ID of note to be updated
   * @param {object} noteDTO - Data containing note data to be updated
   * @returns Updated note
   *  */
  async function updateById({ userId, noteId, noteDTO }) {
    const { name, data } = noteDTO;

    let noteRecord = await Note.findOne({
      where: { id: noteId, userId },
    });

    if (!noteRecord) {
      throwError('Failed to update note', 404, 'Note with this ID could not be updated');
    }

    // Needed to force change updatedAt field
    noteRecord.changed('updatedAt', true);

    noteRecord = await noteRecord.update({
      name,
      updatedAt: new Date(),
    });

    await writeFilePromise(`data/${noteRecord.id}.txt`, data);

    return {
      id: noteId,
      name: noteRecord.name,
    };
  }

  /**
   * Deletes a note record by ID along with its file
   * @param {number} userId - ID of user that note will be assigned to
   * @param {number} noteId - ID of note to be deleted
   * @returns True if note was deleted successfully
   *  */
  async function deleteById({ userId, noteId }) {
    const notesDestroyed = await Note.destroy({
      where: {
        id: noteId,
        userId,
      },
    });

    if (notesDestroyed !== 1) {
      throwError('Failed to remove note', 404, 'Note with this ID could not be deleted');
    }

    await deleteFilePromise(`data/${noteId}.txt`);

    return true;
  }

  return {
    create,
    getById,
    getAllNotes,
    deleteById,
    updateById,
  };
};

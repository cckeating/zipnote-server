const { Note } = require('../../db/models');

const FileService = require('../FileService')();
const noteService = require('./service')({ Note, FileService });

/**
 * POST method to create a note
 *  */
exports.postNote = async (req, res, next) => {
  try {
    const result = await noteService.create({
      userId: req.user.id,
      note: {
        ...req.body,
      },
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET method to get list of notes
 *  */
exports.getNotes = async (req, res, next) => {
  try {
    const result = await noteService.getAllNotes({
      userId: req.user.id,
      query: {
        limit: req.query.limit,
        offset: req.query.offset,
        name: req.query.name,
      },
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET method to get a note by ID
 *  */
exports.getNoteById = async (req, res, next) => {
  try {
    const result = await noteService.getById({
      userId: req.user.id,
      noteId: req.params.id,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT method to update a note by ID
 *  */
exports.updateNoteById = async (req, res, next) => {
  try {
    const result = await noteService.updateById({
      userId: req.user.id,
      noteDTO: {
        ...req.body,
      },
      noteId: req.params.id,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE method to delete note by ID
 *  */
exports.deleteById = async (req, res, next) => {
  try {
    await noteService.deleteById({
      userId: req.user.id,
      noteId: req.params.id,
    });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
};

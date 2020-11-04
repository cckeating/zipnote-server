const express = require('express');
const { body } = require('express-validator');

const controller = require('./controller');
const isAuth = require('../../middleware/isAuth');
const validate = require('../../middleware/validate');

const router = express.Router();

const postSchema = [body('name').notEmpty(), body('data').notEmpty()];

router.post('/', postSchema, validate, isAuth, controller.postNote);

router.get('/:id', isAuth, controller.getNoteById);

router.get('/', isAuth, controller.getNotes);

router.put('/:id', postSchema, validate, isAuth, controller.updateNoteById);

router.delete('/:id', isAuth, controller.deleteById);

module.exports = router;

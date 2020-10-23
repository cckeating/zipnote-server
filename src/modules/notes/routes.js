const express = require('express');
const controller = require('./controller');
const isAuth = require('../../middleware/isAuth');

const router = express.Router();

router.post('/', isAuth, controller.postNote);

router.get('/:id', isAuth, controller.getNoteById);

router.get('/', isAuth, controller.getNotes);

router.put('/:id', isAuth, controller.updateNoteById);

router.delete('/:id', isAuth, controller.deleteById);

module.exports = router;

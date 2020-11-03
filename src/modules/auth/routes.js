const express = require('express');
const { body } = require('express-validator');
const validate = require('../../middleware/validate');
const controller = require('./controller');

const router = express.Router();

router.post(
  '/signup',
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('password').notEmpty(),
  ],
  validate,
  controller.signup
);

router.post(
  '/login',
  [body('email').isEmail().trim().notEmpty(), body('password').notEmpty()],
  validate,
  controller.login
);

module.exports = router;

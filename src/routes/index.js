const express = require('express');
const authRoutes = require('../modules/auth/routes');
const noteRoutes = require('../modules/notes/routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);

module.exports = router;

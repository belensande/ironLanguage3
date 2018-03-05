const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth.controller');
const collectionRoutes = require('./collections.controller');
const profilesRoutes = require('./profiles.controller');
const relationsRoutes = require('./relations.controller');
const meetupsRoutes = require('./meetup.controller');
const messagesRoutes = require('./messages.controller');

router.use('/', authRoutes);
router.use('/collections', collectionRoutes);
router.use('/profiles', profilesRoutes);
router.use('/relations', relationsRoutes);
router.use('/meetups', meetupsRoutes);
router.use('/messages', messagesRoutes);

module.exports = router;

const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth.controller');
const collectionRoutes = require('./collections.controller');
const profilesRoutes = require('./profiles.controller');
const relationsRoutes = require('./relations.controller');
const meetupsRoutes = require('./meetup.controller');

router.use('/', authRoutes);
router.use('/collections', collectionRoutes);
router.use('/profiles', profilesRoutes);
router.use('/relations', relationsRoutes);
router.use('/meetups', meetupsRoutes);

module.exports = router;

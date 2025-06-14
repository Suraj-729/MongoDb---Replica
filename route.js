const express = require('express');
const router = express.Router();
const controller = require('./controller');

// For Primary collection in ReplicaDb
router.post('/primary', controller.createPrimary);
router.get('/primary', controller.getPrimary);

// For Secondary collection in ReplicaDbSecondary
router.get('/secondary', controller.getSecondary);
router.post('/user', controller.createUser);

module.exports = router;
const express = require('express');
const {createLocation, createAlert} = require('../controllers/alertController');
const router = express.Router();

router.post('/createLocation', createLocation);
router.post('/createAlert', createAlert);

module.exports = router;
const express = require('express');
const {createLocation, createAlert,updateLatLong,getAlertLocationID} = require('../controllers/alertController');
const router = express.Router();

router.post('/createLocation', createLocation);
router.post('/createAlert', createAlert);
router.put('/updateLatLong/:locationID',updateLatLong);
router.get('/getAlertLocationID/:custID_Nr',getAlertLocationID)

module.exports = router;
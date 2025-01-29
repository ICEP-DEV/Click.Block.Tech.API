const AlertService = require('../service/alertService');

const createLocation = (req, res) =>{
    const locationData = req.body;
    AlertService.createLocation(locationData, (err, result)=>{
        if(err){
            console.error('Error creating Location',err);
            return res.status(500).json({error: 'Failed to create Location', message: err.message});
        }
       res.status(200).json(result);
    });
}
const createAlert = (req, res)=>{
    const alertData = req.body;

    AlertService.createAlert(alertData, (err,result)=>{
        if(err){
            console.error('Error creating Alert', err);
            return res.status(500).json({error: 'Failed to create Alert', message: err.message});
        }
        res.status(201).json(result);
    });
}
const updateLatLong = (req, res)=>{
    const locationData = req.body;
    const locationId = req.params.locationID
    AlertService.updateLatLong(locationId, locationData, (err, result)=>{
        if(err){
            console.log('Error updating Lat Long', err);
            return res.status(500).json({error: 'Failed to update Lat Long', message: err.message});
        }
        res.status(201).json(result);
    });

}
const getAlertLocationID = (req,res)=>{
    const custID_Nr = req.params.custID_Nr;
      AlertService.getAlertLocationID(custID_Nr,(err, result) => {
        if(err){
          return res.status(500).send(err);
        }
        if(result){
          res.status(200).send(result);
        }else{
          res.status(404).send('Alert Location ID  not found).');
        }
      });
    };

module.exports = {createLocation, createAlert, updateLatLong, getAlertLocationID};
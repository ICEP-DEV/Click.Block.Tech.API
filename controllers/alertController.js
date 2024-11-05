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
module.exports = {createLocation, createAlert};
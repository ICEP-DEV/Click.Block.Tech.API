const AtmService = require('../service/atmService');

const verifyCardNumber = (req, res)=>{
    const cardNum = req.params.cardNumber;

    if(!cardNum){
        return res.status(400).send({error: 'Card Number is required'});
    }

    AtmService.verifyCardNum(cardNum, (err, result)=>{
        if(err){
            return res.status(500).send({error: err.message});
        }
        res.status(201).send(result);
    })
}

const AuthenticateCustomer = (req, res) =>{
    const inputPIN = req.params.inputPIN;
    const encryptedStoredPIN = req.params.encryptStoredPIN;
    const bcrypt = require('bcryptjs');
    if(!inputPIN){
        return res.status(400).send({error: 'Remote PIN is required'});
    }
    bcrypt.compare(inputPIN, encryptedStoredPIN, (err, result) => {
        if (err) {
            // Handle error
            console.error('Error comparing PIN:', err);
            return;
        }
 
        if (result) {
        // PIN match, authentication successful
        console.log('Remote PINS match');
        res.status(200).send(result);
        } else {
        // PIN don't match, authentication failed
        console.log('Remote PINS dont match');
        res.status(200).send(result);
        }
    });

}
module.exports = {
    verifyCardNumber,
    AuthenticateCustomer
}
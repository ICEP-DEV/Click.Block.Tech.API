const atmDAO = require('../DAO/atmDAO');

const atmService = {
    verifyCardNum: (cardNumber, callback)=>{
        if(!cardNumber){
            callback(new Error('Card number is required'));
        }
        atmDAO.verifyCardNum(cardNumber, callback);
    }
}
module.exports = atmService;
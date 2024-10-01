const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/AdminController'); 


router.get('/admins/:id', AdminController.getAdminById);


module.exports = router;

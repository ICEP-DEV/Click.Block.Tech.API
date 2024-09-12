const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/AdminController'); // Adjust the path as needed

// Get an admin by ID
router.get('/admins/:id', AdminController.getAdminById);


module.exports = router;

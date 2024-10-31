const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Admin routes
router.post('/create', AdminController.createAdmin);
router.post('/login', AdminController.login);
router.get('/:id', AdminController.getAdmin);
router.put('/:id', AdminController.updateAdmin);
router.delete('/:id', AdminController.deleteAdmin);

module.exports = router;

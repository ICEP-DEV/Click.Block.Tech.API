const AdminService = require('../service/adminService');

const AdminController = {
    createAdmin: (req, res) => {
        const adminData = req.body;
        AdminService.createAdmin(adminData, (err, result) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            res.status(201).json(result);
        });
    },

    login: (req, res) => {
        const { Email, LoginPin } = req.body;
        AdminService.login(Email, LoginPin, (err, result) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            res.json(result);
        });
    },

    getAdmin: (req, res) => {
        const adminID = req.params.id;
        AdminService.getAdminById(adminID, (err, admin) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.json(admin);
        });
    },

    updateAdmin: (req, res) => {
        const adminID = req.params.id;
        const updateData = req.body;
        AdminService.updateAdmin(adminID, updateData, (err, result) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            res.json({ message: 'Admin updated successfully', result });
        });
    },

    deleteAdmin: (req, res) => {
        const adminID = req.params.id;
        AdminService.deleteAdmin(adminID, (err, result) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            res.json({ message: 'Admin deleted successfully', result });
        });
    },

    getAllAlerts: (req, res) => {
        AdminService.getAllAlerts((err, result) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            res.json({ message: 'Successfully fetched alerts', result });
        });
    },

    getLocationByID: (req, res) => {
        const locationID = req.params.locationID;
        AdminService.getLocationByID(locationID, (err, result) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            res.json({ message: 'Successfully fetched location', result });
        });
    },

    updateCustomerPanicStatus: (req, res) => {
        const custIdNr = req.params.custIdNr;
        AdminService.updateCustomerPanicStatus(custIdNr, (err, result) => {
            if (err) {
                return res.status(err.status || 500).json(err);
            }
            res.json({ message: 'Customer PanicButtonStatus updated successfully', result });
        });
    }
};

module.exports = AdminController;

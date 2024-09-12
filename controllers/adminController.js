const AdminDAO = require('../DAO/adminDAO'); // Adjust the path as needed

class AdminController {
    // Get an admin by ID
    static getAdminById(req, res) {
        const adminId = req.params.id;
        AdminDAO.getAdminById(adminId, (err, admin) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err.message });
            }
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.status(200).json(admin);
        });
    }
}

module.exports = AdminController;

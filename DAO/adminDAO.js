const db = require('../config/config');

class AdminDAO {

    // Get an admin by ID
    getAdminById(adminId, callback) {
        const query = 'SELECT * FROM admins WHERE id = ?';
        db.query(query, [adminId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    }

 
}

// Export the AdminDAO class
module.exports = new AdminDAO();

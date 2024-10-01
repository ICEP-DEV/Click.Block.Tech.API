const AdminDAO = require('./DAO/adminDAO'); // Adjust the path as needed
const Admin = require('./models/admin'); // Adjust the path as needed

class AdminService {
   

    // Get an admin by ID
    static getAdminById(adminId, callback) {
        if (!adminId) {
            return callback(new Error('Admin ID is required'));
        }

        AdminDAO.getAdminById(adminId, (err, adminData) => {
            if (err) {
                return callback(err);
            }
            if (!adminData) {
                return callback(new Error('Admin not found'));
            }
            
            // Create an Admin instance from data
            const admin = new Admin(adminData.id, adminData.Firstname, adminData.Email, null);
            admin._PasswordHash = adminData.PasswordHash; // Set the hashed password for comparison purposes

            callback(null, admin.displayAdminDetails());
        });
    
            // Create an Admin instance with the fetched data
            const admin = new Admin(adminData.id, adminData.Firstname, adminData.Email, null);
            admin._PasswordHash = adminData.PasswordHash; // Set the hashed password

            admin.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return callback(err);
                }
                if (!isMatch) {
                    return callback(new Error('Invalid email or password'));
                }
                callback(null, admin.displayAdminDetails());
            });
        }
};
    


module.exports = AdminService;

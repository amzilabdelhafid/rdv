const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { admin_username, admin_password } = req.body;

    const admin = await Admin.findOne({ admin_username });

    if (admin && (await bcrypt.compare(admin_password, admin.admin_password))) {
        res.json({
            _id: admin._id,
            admin_username: admin.admin_username,
            admin_email: admin.admin_email,
            token: generateToken(admin._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
}
);

module.exports = { loginAdmin };
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    admin_username: {
        type: String,
        required: true,
        unique: true
    },
    admin_password: {
        type: String,
        required: true
    },
    admin_email: {
        type: String,
        required: true,
        unique: true
    },
    admin_profile_picture: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const adminModel = mongoose.model('Admin', adminSchema);

module.exports = adminModel;
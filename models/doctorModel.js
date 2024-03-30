const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctor_firstname: {
        type: String,
        required: true
    },
    doctor_lastname: {
        type: String,
        required: true
    },
    doctor_email: {
        type: String,
        required: true
    },
    doctor_password: {
        type: String,
        required: true
    },
    doctor_specialty: {
        type: String,
        required: true
    },
    doctor_address: {
        doctor_address_street: {
            type: String,
            required: [true, "Street is required"]
        },
        doctor_address_city: {
            type: String,
            required: [true, "City is required"]
        },
        doctor_address_country: {
            type: String,
            required: [true, "Country is required"]
        },
        doctor_address_coordinates: {
            doctor_address_latitude: {
                type: Number,
                required: false
            },
            doctor_address_longitude: {
                type: Number,
                required: false
            }
        }
    },
    doctor_phone: {
        type: String,
        required: true
    },
    doctor_profile_picture: {
        type: String,
        required: false
    },
    doctor_cabinet_images: [{
        type: String,
        required: false
    }],
    doctor_profile_description: {
        type: String,
        required: false
    },
    doctor_certifications: [{
        doctor_certification_name: {
            type: String,
            required: true
        },
        doctor_certification_image: {
            type: String,
            required: true
        }
    }],
    doctor_rdv_history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rdvModel'
    }],
    doctor_compte_status: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const doctorModel = mongoose.model('doctorModel', doctorSchema);

module.exports = doctorModel;

.env config/ models/ package-lock.json package.json server.js
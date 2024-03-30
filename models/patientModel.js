const mongoose = require("mongoose");


// Define the patientModel schema
const patientSchema = new mongoose.Schema({
    patient_firstname: {
        type: String,
        required: true,
    },
    patient_lastname: {
        type: String,
        required: true,
    },
    patient_email: {
        type: String,
        required: true,
    },
    patient_password: {
        type: String,
        required: true,
    },
    patient_address: {
        patient_address_street: {
            type: String,
            required: false,
        },
        patient_address_city: {
            type: String,
            required: [true, "City is required"],
        },
    },
    patient_phone: {
        type: String,
        required: true,
    },
 
  patient_rdv_history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rdvModel",
    },
  ],
},
{
  timestamps: true,
});

// Create the patientModel
const patientModel = mongoose.model("patientModel", patientSchema);

module.exports = patientModel;

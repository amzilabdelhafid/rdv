const mongoose = require("mongoose");


// Define the patientModel schema
const patientSchema = new mongoose.Schema({
    patient_firstname: {
        type: String,
        required: [true, "First name is required"],
    },
    patient_lastname: {
        type: String,
        required: [true, "Last name is required"],
    },
    patient_email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    patient_password: {
        type: String,
        required: [true, "Password is required"],
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
        required: [true, "Phone number is required"],
    },
 
  patient_rdv_history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rdvModel",
    }
  ],

  patient_compte_status: {
    type: String,
    required: [true, "Status is required"],
  },
},
{
  timestamps: true,
});

// Create the patientModel
const patientModel = mongoose.model("patientModel", patientSchema);

module.exports = patientModel;

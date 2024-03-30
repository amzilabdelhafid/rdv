const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Patient = require('./models/patientModel');
const Rdv = require('./models/rdvModel');

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// register patient
const registerPatient = asyncHandler(async (req, res) => {
    const { patient_firstname, patient_lastname, patient_email, patient_password, patient_phone, patient_profile_picture, patient_address } = req.body;

    // check if all fields are filled
    if (!patient_firstname || !patient_lastname || !patient_email || !patient_password || !patient_phone || !patient_address) {
        res.status(400);
        throw new Error('All fields are required');
    }

    // check if patient already exists
    const patientExists = await Patient.findOne({ patient_email });

    if (patientExists) {
        res.status(400);
        throw new Error('Patient already exists');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const patient_hashedPassword = await bcrypt.hash(patient_password, salt);

    // create patient
    const patient = await Patient.create({
        patient_firstname,
        patient_lastname,
        patient_email,
        patient_password: patient_hashedPassword,
        patient_phone,
        patient_profile_picture,
        patient_address
    });

    if (patient) {
        res.status(201).json({
            _id: patient._id,
            patient_firstname: patient.patient_firstname,
            patient_lastname: patient.patient_lastname,
            patient_email: patient.patient_email,
            patient_phone: patient.patient_phone,
            patient_profile_picture: patient.patient_profile_picture,
            patient_address: patient.patient_address,
            token: generateToken(patient._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid patient data');
    }
});

// login patient
const loginPatient = asyncHandler(async (req, res) => {
    const { patient_email, patient_password } = req.body;

    // check if all fields are filled
    if (!patient_email || !patient_password) {
        res.status(400);
        throw new Error('All fields are required');
    }

    // check if patient exists
    const patient = await Patient.findOne({ patient_email });

    // check if patient exists and password is correct
    if (patient && (await bcrypt.compare(patient_password, patient.patient_password))) {
        res.json({
            _id: patient._id,
            patient_firstname: patient.patient_firstname,
            patient_lastname: patient.patient_lastname,
            patient_email: patient.patient_email,
            patient_phone: patient.patient_phone,
            patient_profile_picture: patient.patient_profile_picture,
            patient_address: patient.patient_address,
            token: generateToken(patient._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid patient data');
    }
});

// get patient profile
const getPatientProfile = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.patient._id);

    if (patient) {
        res.json({
            _id: patient._id,
            patient_firstname: patient.patient_firstname,
            patient_lastname: patient.patient_lastname,
            patient_email: patient.patient_email,
            patient_phone: patient.patient_phone,
            patient_profile_picture: patient.patient_profile_picture,
            patient_address: patient.patient_address
        });
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});

// update patient profile
const updatePatientProfile = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.patient._id);
    //check if all fields are filled
    if (patient){
        patient.patient_firstname = req.body.patient_firstname || patient.patient_firstname;
        patient.patient_lastname = req.body.patient_lastname || patient.patient_lastname;
        patient.patient_email = req.body.patient_email || patient.patient_email;
        patient.patient_phone = req.body.patient_phone || patient.patient_phone;
        patient.patient_profile_picture = req.body.patient_profile_picture || patient.patient_profile_picture;
        patient.patient_address = req.body.patient_address || patient.patient_address;
// save updated patient
        const updatedPatient = await patient.save();

//return updated patient
        res.json({
            _id: updatedPatient._id,
            patient_firstname: updatedPatient.patient_firstname,
            patient_lastname: updatedPatient.patient_lastname,
            patient_email: updatedPatient.patient_email,
            patient_phone: updatedPatient.patient_phone,
            patient_profile_picture: updatedPatient.patient_profile_picture,
            patient_address: updatedPatient.patient_address
        });
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});

// admin permissions _______________________________________________________
// get all patients
const getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({});
    res.json(patients);
});

// get a patient by id
const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.json(patient);
});

// update patient
const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    patient.patient_firstname = req.body.patient_firstname || patient.patient_firstname;
    patient.patient_lastname = req.body.patient_lastname || patient.patient_lastname;
    patient.patient_email = req.body.patient_email || patient.patient_email;
    patient.patient_phone = req.body.patient_phone || patient.patient_phone;
    patient.patient_profile_picture = req.body.patient_profile_picture || patient.patient_profile_picture;
    patient.patient_address = req.body.patient_address || patient.patient_address;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
});

// delete patient
const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    await patient.remove();
    res.json({ message: 'Patient deleted' });
});



module.exports = {
    registerPatient,
    loginPatient,
    getPatientProfile,
    updatePatientProfile,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
};
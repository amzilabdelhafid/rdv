const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');
// const Rdv = require('./models/rdvModel');

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



// get an array of object (list) of rdvs time

const getRdvTimeList = asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
      const { start_hour, fin_hour, rdv_duration } = req.body;
      if (!start_hour || !fin_hour || !rdv_duration) {
        res.status(400);
        throw new Error("All fields are required");
      }
  
      // convert to minutes
      const start_hour_minutes = parseInt(start_hour.split(":")[0]) * 60 + parseInt(start_hour.split(":")[1]);
      const fin_hour_minutes = parseInt(fin_hour.split(":")[0]) * 60 + parseInt(fin_hour.split(":")[1]);
  
      // getv the number of rdvs per day
      const rdv_per_day = (fin_hour_minutes - start_hour_minutes) / rdv_duration;
  
      //array of rdv time objects
      const rdv_time_list = [];
      for (let i = 0; i < rdv_per_day; i++) {
        const start_time = new Date(0, 0, 0, 0, 0, 0, 0);
        start_time.setMinutes(start_hour_minutes + i * rdv_duration);
    
        const fin_time = new Date(0, 0, 0, 0, 0, 0, 0);
        fin_time.setMinutes(start_hour_minutes + (i + 1) * rdv_duration);
    
        const start_time_str = `${start_time.getHours()}:${start_time.getMinutes() < 10 ? '0' : ''}${start_time.getMinutes()}`;

        const fin_time_str = `${fin_time.getHours()}:${fin_time.getMinutes() < 10 ? '0' : ''}${fin_time.getMinutes()}`;
    
        rdv_time_list.push({ start_time: start_time_str, fin_time: fin_time_str });
    }
    
      rdv_time_list.push({ "number of rdv": rdv_time_list.length });
      res.status(200).json(rdv_time_list);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


module.exports = {
    registerPatient,
    loginPatient,
    getPatientProfile,
    updatePatientProfile,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getRdvTimeList
};
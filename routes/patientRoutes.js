const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient, getPatientProfile, updatePatientProfile } = require('../controllers/patientController');
const patientAuth = require('../middleware/patientAuth');


router.route('/register').post(registerPatient);
router.route('/login').post(loginPatient);
router.route('/profile').get(patientAuth, getPatientProfile);
router.route('/update/:id').put(patientAuth, updatePatientProfile);

module.exports = router;
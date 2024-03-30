const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor, getDoctorProfile, updateDoctorProfile } = require('../controllers/doctorController'); 
const doctorAuth = require('../middleware/doctorMiddleware');


router.route('/register').post(registerDoctor);
router.route('/login').post(loginDoctor);
router.route('/profile').get(doctorAuth, getDoctorProfile);
router.route('/update/:id').put(doctorAuth, updateDoctorProfile);


module.exports = router;
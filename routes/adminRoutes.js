const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');

router.route('/login').post(loginAdmin);

module.exports = router;
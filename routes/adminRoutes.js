const express = require('express');
const router = express.Router();
const { loginAdmin, getRdvTimeList } = require('../controllers/adminController');
const authAdmin = require('../middleware/adminMiddleware');

router.route('/login').post(loginAdmin);
router.route('/getRdvTimeList').get(authAdmin, getRdvTimeList );

module.exports = router;
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { admin_username, admin_password } = req.body;

    const admin = await Admin.findOne({ admin_username });

    if (admin && (await bcrypt.compare(admin_password, admin.admin_password))) {
        res.json({
            _id: admin._id,
            admin_username: admin.admin_username,
            admin_email: admin.admin_email,
            token: generateToken(admin._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
}
);

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

module.exports = { loginAdmin, getRdvTimeList };
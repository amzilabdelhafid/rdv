const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");

const doctorAuth = asyncHandler(async (req, res, next) => {
    let token;
    
    // Check if the authorization header exists and starts with Bearer
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
        // Get the token from the authorization header
        token = req.headers.authorization.split(" ")[1];
    
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        // Find the doctor by id
        req.doctor = await Doctor.findById(decoded.id).select("-doctor_password");
    
        next();
        } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
        }
    }
    
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    });

module.exports = doctorAuth;
const asyncHandler = require("express-async-handler");
const rdvModel = require("../models/rdvModel");
const doctorModel = require("../models/doctorModel");
const patientModel = require("../models/patientModel");

//doctor permission___________________________________________________________

// Create a new rdv only by doctor && add it to his history
const createRdv = asyncHandler(async (req, res) => {
  try {
    // Get the rdv data from the request body
    const { rdv_date, rdv_time, rdv_doctor } = req.body;

    if (!rdv_date || !rdv_time || !rdv_doctor) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Create a new rdv object
    const rdv = new rdvModel({
      rdv_date,
      rdv_time,
      rdv_doctor,
    });

    // Save the rdv to the database
    const createdRdv = await rdv.save();

    // Find the doctor and add the rdv to their history
    const doctor = await doctorModel.findById(rdv_doctor);
    if (!doctor) {
      res.status(404);
      throw new Error("Doctor not found");
    }
    doctor.doctor_rdv_history.push(createdRdv._id);
    await doctor.save();

    res.status(201).json(createdRdv);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a rdv only by doctor
const updateRdv = asyncHandler(async (req, res) => {
  try {
    // Get the rdv data from the request body
    const { rdv_date, rdv_time } = req.body;

    // Find the rdv by id
    const rdv = await rdvModel.findById(req.params.id);
    if (!rdv) {
      res.status(404);
      throw new Error("Rdv not found");
    }

    // Check if the doctor is the one who created the rdv
    if (rdv.rdv_doctor.toString() !== req.doctor._id.toString()) {
      res.status(403);
      throw new Error("You do not have permission to update this rdv");
    }

    // Update the rdv
    rdv.rdv_date = rdv_date || rdv.rdv_date;
    rdv.rdv_time = rdv_time || rdv.rdv_time;

    // Save the updated rdv to the database
    const updatedRdv = await rdv.save();

    res.status(200).json(updatedRdv);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a rdv only by doctor
const deleteRdv = asyncHandler(async (req, res) => {
  try {
    // Find the rdv by id
    const rdv = await rdvModel.findById(req.params.id);
    if (!rdv) {
      res.status(404);
      throw new Error("Rdv not found");
    }

    // Check if the doctor is the one who created the rdv
    if (rdv.rdv_doctor.toString() !== req.doctor._id.toString()) {
      res.status(403);
      throw new Error("You do not have permission to delete this rdv");
    }

    // Find the doctor and remove the rdv from their history
    const doctor = await doctorModel.findById(req.doctor._id);
    doctor.doctor_rdv_history = doctor.doctor_rdv_history.filter(
      (rdvId) => rdvId.toString() !== req.params.id
    );
    await doctor.save();

    // Delete the rdv
    await rdv.remove();

    res.status(200).json({ message: "Rdv deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//patient permission ___________________________________________________________

// Reserve a rdv only by patient
const reserveRdv = asyncHandler(async (req, res) => {
  try {
    // Get the rdv id from the request body
    const { rdv_id } = req.body;

    if (!rdv_id) {
      res.status(400);
      throw new Error("Rdv id is required");
    }

    // Find the rdv by id
    const rdv = await rdvModel.findById(rdv_id);
    if (!rdv) {
      res.status(404);
      throw new Error("Rdv not found");
    }

    // Check if the rdv is already reserved
    if (rdv.rdv_patient) {
      res.status(400);
      throw new Error("Rdv is already reserved");
    }

    // Reserve the rdv and set the rdv_status to 'reserved'
    rdv.rdv_patient = req.patient._id;
    rdv.rdv_status = "reserved";
    const reservedRdv = await rdv.save();

    // Find the patient and add the rdv to their history
    const patient = await patientModel.findById(req.patient._id);
    patient.patient_rdv_history.push(reservedRdv._id);
    await patient.save();

    res.status(200).json(reservedRdv);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Undo the reservation of a rdv only by patient
const undoReserveRdv = asyncHandler(async (req, res) => {
  try {
    // Get the rdv id from the request body
    const { rdv_id } = req.body;

    if (!rdv_id) {
      res.status(400);
      throw new Error("Rdv id is required");
    }

    // Find the rdv by id
    const rdv = await rdvModel.findById(rdv_id);
    if (!rdv) {
      res.status(404);
      throw new Error("Rdv not found");
    }

    // Check if the rdv is reserved by the patient
    if (rdv.rdv_patient.toString() !== req.patient._id.toString()) {
      res.status(403);
      throw new Error("You do not have permission to undo this reservation");
    }

    // Undo the reservation and set the rdv_status to 'available'
    rdv.rdv_patient = null;
    rdv.rdv_status = "available";
    const updatedRdv = await rdv.save();

    // Find the patient and remove the rdv from their history
    const patient = await patientModel.findById(req.patient._id);
    patient.patient_rdv_history = patient.patient_rdv_history.filter(
      (rdvId) => rdvId.toString() !== rdv_id
    );
    await patient.save();

    res.status(200).json(updatedRdv);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// admin permission ___________________________________________________________

// Get all rdvs
const getAllRdvs = asyncHandler(async (req, res) => {
  try {
    const rdvs = await rdvModel.find();
    res.status(200).json(rdvs);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a rdv by id
const getRdvById = asyncHandler(async (req, res) => {
  try {
    const rdv = await rdvModel.findById(req.params.id);
    if (!rdv) {
      res.status(404);
      throw new Error("Rdv not found");
    }
    res.status(200).json(rdv);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  createRdv,
  updateRdv,
  deleteRdv,
  reserveRdv,
  undoReserveRdv,
  getAllRdvs,
  getRdvById,
};

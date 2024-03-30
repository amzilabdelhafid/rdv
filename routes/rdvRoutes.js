const express = require("express");
const router = express.Router();
const doctorAuth = require("../middleware/doctorAuth");
const patientAuth = require("../middleware/patientAuth");
const adminAuth = require("../middleware/adminAuth");
const {
    createRdv,
    updateRdv,
    deleteRdv,
    reserveRdv,
    undoReserveRdv,
    getAllRdvs,
    getRdvById,
} = require("../controllers/rdvController");

// doctor permissions
router.route("/").post(doctorAuth, createRdv);
router.route("/:id").put(doctorAuth, updateRdv).delete(doctorAuth, deleteRdv);

// patient permissions
router.route("/reserve/:id").put(patientAuth, reserveRdv);
router.route("/undo/:id").put(patientAuth, undoReserveRdv);

// admin permissions
router.route("/").get(adminAuth, getAllRdvs);
router.route("/:id").get(adminAuth, getRdvById);

module.exports = router;

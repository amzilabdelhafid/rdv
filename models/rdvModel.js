const mongoose = require("mongoose");

const rdvSchema = new mongoose.Schema({
    rdv_date: { type: Date, required: [true, "Date is required"] },
    rdv_time: { type: String, required: [true, "Time is required"] },
    rdv_status: {
        type: String,
        enum: ["available", "reserved", "expired"],
        default: "available",
    },
    rdv_patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    rdv_doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null},
},
{
    timestamps: true,
});

// Virtual property to check if rdv_date has expired
rdvSchema.virtual("isExpired").get(function() {
    return this.rdv_date < Date.now();
});

// Middleware to update rdv_status when rdv_date has expired
rdvSchema.pre("save", function(next) {
    if (this.isModified("rdv_date") && this.isExpired) {
        this.rdv_status = "expired";
    }
    next();
});

const Rdv = mongoose.model("rdvModel", rdvSchema);

const mongoose = require("mongoose");
const schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    phone: String,
    gender: String,
});

const orderSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tailor", // Reference the Tailor model
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    clothType: String,
    material: String,
    dateDue: Date,
    reminderFrequency: String,
    notes: String,
    completed: Boolean,
    measurementId: {
        // Reference to the Measurement document
        type: mongoose.Schema.Types.ObjectId,
        ref: "Measurement",
    },
});

const measurementSchema = new schema({
    chestBust: { type: String, default: null },
    backWidth: { type: String, default: null },
    waist: { type: String, default: null },
    frontLength: { type: String, default: null },
    backLength: { type: String, default: null },
    bicep: { type: String, default: null },
    armhole: { type: String, default: null },
    neck: { type: String, default: null },
    shoulderLength: { type: String, default: null },

    hip: { type: String, default: null },
    hipDrop: { type: String, default: null },
    inseam: { type: String, default: null },
    outseam: { type: String, default: null },
    thigh: { type: String, default: null },
    knee: { type: String, default: null },
    ankle: { type: String, default: null },

    shoulderSlope: { type: String, default: null },
    wrist: { type: String, default: null },
    footLength: { type: String, default: null },
    headCircumference: { type: String, default: null },
});

const Customer = mongoose.model("Customer", customerSchema);
const Order = mongoose.model("Order", orderSchema);
const Measurement = mongoose.model("Measurement", measurementSchema);

module.exports = { Customer, Order, Measurement };

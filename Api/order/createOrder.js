//CHECK TODO FILE

const app = require("express").Router();
require("dotenv").config();
const Customer = require("../../models/order").Customer;
const Order = require("../../models/order").Order;
const Measurement = require("../../models/order").Measurement;

// Create a new order
app.post("/new", async (req, res) => {
    try {
        const {
            cname,
            cgender,
            PhoneNumber,
            clothtype,
            pickup,
            rfrequency,
            rdate,
            notes,
            material,
        } = req.body;
        const {
            chestBust,
            backWidth,
            waist,
            frontLength,
            backLength,
            bicep,
            armhole,
            neck,
            shoulderLength,
            hip,
            hipDrop,
            inseam,
            outseam,
            thigh,
            knee,
            ankle,
            shoulderSlope,
            wrist,
            footLength,
            headCircumference,
        } = req.body;

        const newCustomer = new Customer({
            name: cname,
            phone: PhoneNumber,
            gender: cgender,
        });
        await newCustomer.save();

        const newMeasurement = new Measurement({
            chestBust: chestBust,
            backWidth: backWidth,
            waist: waist,
            frontLength: frontLength,
            backLength: backLength,
            bicep: bicep,
            armhole: armhole,
            neck: neck,
            shoulderLength: shoulderLength,
            hip: hip,
            hipDrop: hipDrop,
            inseam: inseam,
            outseam: outseam,
            thigh: thigh,
            knee: knee,
            ankle: ankle,
            shoulderSlope: shoulderSlope,
            wrist: wrist,
            footLength: footLength,
            headCircumference: headCircumference,
        });
        await newMeasurement.save();

        const userId = req.user.userId;
        const newOrder = new Order({
            tailorId: userId,
            customerId: newCustomer._id,
            clothType: clothtype,
            material: material,
            dateDue: pickup,
            reminderFrequency: rfrequency,
            reminderDate: rdate,
            notes: notes,
            completed: false,
            measurementId: newMeasurement._id,
        });
        await newOrder.save();

        res.json({
            status: "success",
            message: "Order created successfully!",
            orderId: newOrder._id, // Send the order ID for reference
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            status: "failed",
            message: "Error creating new order",
        });
    }
});

//TO FETCH ALL ORDERS
app.get("/allOrder", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customerId")
            .populate("measurementId");

        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
});




module.exports = app;

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
            createdBy: userId,
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

//fetch a particular record on click
app.get("/details/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId)
            .populate("customerId")
            .populate("measurementId");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ message: "Error fetching order details" });
    }
});

//search for record based on customer name
app.get("/search", async (req, res) => {
    try {
        const { name } = req.query; // Get customer name from query parameter
        const customers = await Customer.find({
            name: { $regex: name, $options: "i" }, // Case-insensitive search
        });

        if (!customers.length) {
            return res
                .status(404)
                .json({ message: "No orders found for this customer" });
        }
        const customerIds = customers.map((customer) => customer._id);
        const orders = await Order.find({
            customerId: { $in: customerIds },
        })
            .populate("customerId")
            .populate("measurementId");

        res.json(orders);
    } catch (error) {
        console.error("Error searching orders by customer name:", error);
        res.status(500).json({ message: "Error searching orders" });
    }
});

//filter order by date....

// Delete an order
app.delete("/delete/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const orderToDelete = await Order.findById(orderId)
            .populate("customerId")
            .populate("measurementId");

        if (!orderToDelete) {
            return res.status(404).json({ message: "Order not found" });
        }

        await Measurement.deleteOne({ _id: orderToDelete.measurementId });
        await Customer.deleteOne({ _id: orderToDelete.customerId });

        await Order.findByIdAndDelete(orderId);

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order" });
    }
});

module.exports = app;

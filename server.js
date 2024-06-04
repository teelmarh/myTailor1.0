const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const db = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv");

app.use(cors());
app.use(express.json());

// Middleware for verifying JWT tokens
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer " prefix

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to the request
        next(); // Allow access to the protected route
    } catch (err) {
        return res.status(401).json({ message: "Session expired" }); // Handle expired token
    }
};

//routes
const signUpRouter = require("./Api/account/signUp.js");
const OrderRouter = require("./Api/order/createOrder.js");
const profileRouter = require("./Api/account/profile.js");

//route requests
app.use("/account", signUpRouter);
app.use("/order", verifyToken, OrderRouter);
app.use("/user", verifyToken, profileRouter);

app.listen(port, () => {
    console.log(`Server is running`);
});

const app = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import the dotenv package
require("dotenv").config();

// Importing tailor model
const Tailor = require("../../models/tailors");

app.post("/createAccount", async (req, res) => {
    let { fname, lname, email, phoneno, password, confirmPassword } = req.body;

    if (
        !fname ||
        !lname ||
        !phoneno ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        return res.status(401).json({ message: "Please fill all the fields" });
    }

    try {
        // Check for existing email
        const existingUser = await Tailor.findOne({ email });
        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: "User with provided email already exists",
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Tailor object
        const newTailor = new Tailor({
            fname,
            lname,
            email,
            phoneno,
            password: hashedPassword,
        });

        // Save new user and send confirmation message on success
        await newTailor.save();
        return res.json({
            status: "SUCCESS",
            message: "Tailor account created successfully!",
        });
    } catch (err) {
        console.error(err);
        return res.json({
            status: "FAILED",
            message: "An error occurred while creating your account",
        });
    }
});

//LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const user = await Tailor.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Generate JWT token upon successful login
        const payload = { userId: user._id, email: user.email }; 
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h", // Set expiry to 1 hour
        });

        console.log("Generated JWT Token:", token); // TO BE CHANGED!!!

        return res.json({ message: "Login successful!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = app;


const jwt = require("jsonwebtoken");

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

module.exports = verifyToken;

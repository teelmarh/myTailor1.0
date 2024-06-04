const app = require("express").Router();
const Tailor = require("../../models/tailors"); // Tailor model import

// Get tailor profile details
app.get("/profile", async (req, res) => {
  try {
    // Access user ID from decoded token (attached by verifyToken middleware)
    const userId = req.user.userId;

    // Find tailor by ID
    const tailor = await Tailor.findById(userId);

    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    // Return tailor details (excluding sensitive information like password)
    const profile = {
      fname: tailor.fname,
      lname: tailor.lname,
      email: tailor.email,
      phoneno: tailor.phoneno,
      // ... exclude password from response
    };

    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;

const app = require("express").Router();
const Tailor = require("../../models/tailors");
const multer = require("multer");

const upload = multer({
    dest: "./uploads/",
    limits: { fileSize: 1000000 }, // Limit file size to 1 MB
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const extension = file.originalname.split(".").pop();
        if (!allowedExtensions.includes(extension)) {
            cb(new Error("Unsupported file type"));
        } else {
            cb(null, true);
        }
    },
});

// Get tailor profile details
app.get("/profile", async (req, res) => {
    try {
        const userId = req.user.userId;
        const tailor = await Tailor.findById(userId);

        if (!tailor) {
            return res.status(404).json({ message: "Tailor not found" });
        }

        const profile = {
            fname: tailor.fname,
            lname: tailor.lname,
            email: tailor.email,
            phoneno: tailor.phoneno,
        };

        return res.json(profile);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

//profile picture upload
app.post(
    "/profile-picture",
    upload.single("profilePicture"),
    async (req, res) => {
        try {
            const userId = req.user.userId;
            // Check if image was uploaded
            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: "Please select an image to upload" });
            }
            // Update tailor document with image data
            const updatedTailor = await Tailor.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        "image.data": req.file.buffer, // Use Buffer object from uploaded file
                        "image.contentType": req.file.mimetype,
                    },
                },
                { new: true }
            );
            if (!updatedTailor) {
                return res.status(404).json({ message: "Tailor not found" });
            }
            res.status(200).json({
                message: "Profile picture uploaded successfully",
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

module.exports = app;

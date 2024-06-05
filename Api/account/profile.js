const app = require("express").Router();
const Tailor = require("../../models/tailors");
const multer = require("multer");
const Order = require("../../models/order").Order;

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const extension = file.originalname.split(".").pop();

        if (file.size > 5 * 1024 * 1024) {
            return cb(new Error("File size exceeds the limit of 5 MB"));
        }

        if (!allowedExtensions.includes(extension)) {
            cb(new Error("Unsupported file type"));
        } else {
            cb(null, true);
        }
    },
});
// Get tailor profile details
app.get("/", async (req, res) => {
    try {
        const userId = req.user.userId;
        const tailor = await Tailor.findById(userId);

        if (!tailor) {
            return res.status(404).json({ message: "Tailor not found" });
        }

        const orders = await Order.find({ tailorId: userId });

        const totalOrders = orders.length;
        const completedOrders = orders.filter(
            (order) => order.completed === true
        ).length;

        const profile = {
            fname: tailor.fname,
            lname: tailor.lname,
            email: tailor.email,
            phoneno: tailor.phoneno,
            profilePicture: tailor.image?.data
                ? Buffer.from(tailor.image.data).toString("base64")
                : null,
            totalOrders, // Total orders received by the tailor
            completedOrders,
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

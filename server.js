const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
const port = 5000;
require("dotenv");

app.use(cors());
app.use(express.json());

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

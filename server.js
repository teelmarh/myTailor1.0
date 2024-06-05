const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");
const verifyToken = require("./config/verifyToken.js");
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
app.use("/profile", verifyToken, profileRouter);

app.listen(port, () => {
    console.log(`Server is running`);
});

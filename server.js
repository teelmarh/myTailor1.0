const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const db = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv");

app.use(cors());
app.use(express.json());

//routes
const signUpRouter = require("./Api/account/signUp.js");
const OrderRouter = require("./Api/order/createOrder.js");

//route requests
app.use("/account", signUpRouter);
app.use("/order", OrderRouter);

app.listen(port, () => {
    console.log(`Server is running`);
});

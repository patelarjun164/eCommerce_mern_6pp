const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');


//config
dotenv.config({path:"config/config.env"});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//Routes import
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const auth = require('./routes/authRoute');

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);
app.use("/api/v1",auth);

//Middleware for errors
app.use(errorMiddleware);

module.exports = app;
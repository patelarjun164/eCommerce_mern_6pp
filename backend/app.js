const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const cors = require('cors');
// Define your CORS options
const corsOptions = {
    origin: 'https://shoppynexxa.vercel.app', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204, // Response status for successful OPTIONS requests
};

// Use the cors middleware with the defined options
app.use(cors(corsOptions));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "config/config.env" });
}

app.use(express.json({ limit: '50mb' }));
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

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", auth);

//Middleware for errors
app.use(errorMiddleware);

module.exports = app;
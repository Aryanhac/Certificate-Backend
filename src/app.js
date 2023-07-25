const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("../middleware/error");
const app = express();
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config({ path: "Backend/config/config.env" });

// add this below app.use(helmet())

// add this line below const app = express();

app.get("/", function (req, res) {
  //when we get an http get request to the root/homepage
  res.send("Hello World");
});

app.get("/greet", function (req, res) {
  //when we get an http get request to the root/homepage
  res.json({ sdsd: "Hello World" });
});

//middleware
app.use(compression()); //Compress all routes
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "100kb" }));
app.use(fileupload());
app.use(express.json());
app.use(cookieParser());

//Router
const Generation = require("./Routers/Generation");
const user = require("./Routers/User");
const verify = require("./Routers/Verify");

app.use("/", Generation);
app.use("/", user);
app.use("/", verify);

//Error middleware
app.use(errorMiddleware);

module.exports = app;

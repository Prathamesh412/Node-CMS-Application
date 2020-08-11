const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const passport = require('passport');
const {
  globalVariables
} = require('./config/configuration');
const {
  mongoDbUrl,
  PORT
} = require("./config/configuration");


const app = express();

//bodyParser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

mongoose
  .connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("MongoDB Connected Successfully.");
  })
  .catch((err) => {
    console.log("Database connection failed.");
  });

/* Configure express*/
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

/*  Flash and Session*/
app.use(
  session({
    secret: "anysecret",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

/* Use Global Variables */
app.use(globalVariables);

// FIle Upload
app.use(fileUpload());

//app.engine("ejs", engine);
app.set("view engine", "ejs");

//Method Override Middleware

app.use(methodOverride("newMethod"));

/* Routes */
const defaultRoutes = require("./routes/default");
app.use("/", defaultRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

/* Start The Server */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
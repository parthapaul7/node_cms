// 3rd Party Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const User = require("./models/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();


const MONGO_DB_URL = "mongodb://127.0.0.1:27017/testDB";

const app = express();

mongoose
  .connect(MONGO_DB_URL)
  .then(result => {

    // Listen on port 1000
    const port = process.env.PORT || 3000;
    app.listen(port,"0.0.0.0", () =>
      console.log("Express app listening on port " + port)
    );
  })
  .catch(err => {
    console.log("Not connected to db: " + err);
  });

var db = mongoose.connection;

// Handle mongo error checking
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we are connected!");
});

// Parse incoming requests

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// use cors
app.use(cors());
app.use(cookieParser())
// Use sessions for tracking logins
app.use(
  session({
    secret: "simplifyjs rocks!",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);

// Session isLogin
app.use((req, res, next) => {
  res.locals.isLogin = req.session.userId != undefined;
      res.locals.userName = "";
      res.locals.userName = "";
  next();
});

// Middleware for Flash
app.use(flash());

// Serve static files from template
app.use(express.static(__dirname + "/template"));

// Set View Engine - EJS template
app.set("view engine", "ejs");

// View engine directory
app.set("views", "views");

// User session
app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findById(req.session.userId)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      res.locals.userName = req?.user?.username || "";
      res.locals.isAdminUser = req?.user?.isAdmin || false;
      next();
    })
    .catch((err) => {
      next(err);
    });
});


// Router module
const registerRouter = require("./routes/register"),
  profileRouter = require("./routes/profile"),
  abstractRouter = require("./routes/post"),
  test = require("./routes/api/test"),
  assetFiles = require("./routes/api/assetFiles"),
  homeRouter = require("./routes/home");

// Routes
app.use("/",homeRouter);
app.use("/",profileRouter);
app.use("/",registerRouter);
app.use("/abstract",abstractRouter);
app.use("/api",test);
app.use("/",assetFiles);

// Catch 404 and forward to error handler
var notFoundCtrl = require("./controller/error.js");
app.use(notFoundCtrl.getNotFound);

// Server Error handler
// Define as the last app.use callback
app.use(function (err, req, res, next) {
  var statusCode = err.status || 500;
  res.render("error", {
    pageTitle: err.status,
    errorStatus: statusCode,
    errMessage: err.message,
  });
});

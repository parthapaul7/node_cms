// 3rd Party Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const User = require("./models/user");
const tunnel = require("tunnel-ssh");

// Express app
const app = express();

// const config = {
//   username: "partha",
//   host: "167.172.152.18",
//   port: 22,
//   dstPort: 27017,
//   localHost: "127.0.0.1",
//   password: "paulteli",
// };

const MONGO_DB_URL = "mongodb://127.0.0.1:27017/testDB";

// Connect to MongoDB Atlas
// const server = tunnel(config, function (error, server) {
//   if (error) {
//     console.log("SSH connection error: " + error);
//   }
//   mongoose.connect("mongodb://localhost:27017/testDB");

//   var db = mongoose.connection;
//   db.on("error", console.error.bind(console, "DB connection error:"));

//   db.once("open", function () {
//     // we're connected!
//     console.log("DB connection successful");
//     const port = process.env.PORT || 1000;
//     app.listen(port, () =>
//       console.log("Express app listening on port " + port)
//     );
//     // console.log(db);
//   });
//   console.log("next");
//   return db;
// });
mongoose
  .connect(MONGO_DB_URL,{newUrlParser: true})
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
app.use(bodyParser.urlencoded({ extended: false }));

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
      next();
    })
    .catch((err) => {
      next(err);
    });
});


// Router module
const registerRouter = require("./routes/register"),
  profileRouter = require("./routes/profile"),
  postRouter = require("./routes/post"),
  test = require("./routes/api/test");

// Routes
app.use(profileRouter);
app.use(registerRouter);
app.use(postRouter);
app.use(test);

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

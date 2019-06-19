const dotenv = require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const Sequelize = require("sequelize");
var flash = require("connect-flash-plus");
var session = require("express-session");
const keys = require("./config/keys");
global.cn = function(o) {
  return "undefined" == typeof o || null == o || "" == o.toString().trim();
};

// Connect flash
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

//Connect to mySQL
const sequelize = new Sequelize(
  keys.mySQL.database,
  keys.mySQL.user,
  keys.mySQL.password,
  {
    host: keys.mySQL.host,
    dialect: "mysql"
  }
);
sequelize
  .authenticate()
  .then(() => {
    
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });


//Ejs
app.use(expressLayout);
app.set("view engine", "ejs");

// Express body parser
app.use(
  express.urlencoded({
    extended: true
  })
);

//Router
app.use("/", require("./route/route"));
app.use("/public", express.static("public"));
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

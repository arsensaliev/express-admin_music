const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

// Views
app.set("views", path.join(__dirname, "./source/template/pages"));
app.set("view engine", "pug");

// Statics
app.use(express.static(path.join(__dirname, "./public")));

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connect-flash
app.use(cookieParser("secret"));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "loftschool",
        cookie: { maxAge: 8000000000 }
    })
);
app.use(flash());

//Routes
app.use("/", require("./server/routes/index"));

app.listen(3000, () => console.log("run server in port 3000"));

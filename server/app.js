require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const logger = require("morgan");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const colors = require("colors");

//Connect to DB
connectDB();

//const indexRouter = require("./routes/index");
const notebooksRouter = require("./routes/notebook");
const todosRouter = require("./routes/todos");
const authRouter = require("./routes/auth");

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 500, // limit each IP to 500 requests per windowMs
});
app.use(limiter);
app.use(hpp());
app.use(cors());

//static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/notebooks", notebooksRouter);
app.use("/api/v1/todos", todosRouter);
app.use("/api/v1/auth", authRouter);

//static folder
app.use(express.static(path.join(__dirname, "public")));
//Handle spa
app.all("*", (_req, res) => {
  try {
    res.sendFile(__dirname + "/public/index.html");
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
});
app.use(errorHandler);

module.exports = app;

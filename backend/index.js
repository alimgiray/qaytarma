require("dotenv").config();

const express = require("express");
const app = express();

const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(hpp());

app.use(express.json({ limit: "30mb" }));

app.use("/api", require("./api"));
// Save audio files
app.use("/audio", express.static("./audio/"));
// Global error handler
app.use(require("./errors/error-handler"));

// start server
app.listen(process.env.PORT, () =>
  console.log(`App listening on port: ${process.env.PORT}`)
);

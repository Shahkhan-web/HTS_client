const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const bodyParser = require("body-parser");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

const { getObject, getcert, uploadImage } = require("./config/s3manager");

const PORT = process.env.PORT || 8000;

// create application/json parser
var jsonParser = bodyParser.json({ limit: "50mb" });

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  limit: "5mb",
  parameterLimit: 100000,
  extended: false,
});

// dot env files
dotenv.config();

app.set("trust proxy", 1);
// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(jsonParser);
app.use(urlencodedParser);

//middleware for cookies
app.use(cookieParser());

app.use(errorHandler);

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// rout es
app.use("/", require("./routes/root"));

app.get("/image/:key", function (req, res, next) {
  const key = req.params.key;
  const readStream = getObject(key);

  readStream.on("error", (err) => {
    // handle the error
    res.status(404).json({ err: `Error retrieving file: Invalid key` });
    return;
  });

  readStream.pipe(res);
});
app.get("/cert/:key", function (req, res, next) {
  const key = req.params.key;
  const readStream = getcert(key);

  readStream.on("error", (err) => {
    // handle the error
    res.status(404).json({ err: `Error retrieving file: Invalid key` });
    return;
  });

  readStream.pipe(res);
});

app.use("/single", uploadImage, (req, res) => {
  res.json({ status: "200" });
});

app.use("/farmer", require("./routes/farmer"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

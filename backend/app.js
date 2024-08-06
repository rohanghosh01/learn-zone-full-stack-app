const express = require("express");
const app = express();
const cors = require("cors");
const sls = require("serverless-http");
const config = require("./config/config.json");
const PORT = config.PORT || 3000;
const bodyParser = require("body-parser");
const languageMiddleware = require("./middlewares/language.middleware");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const feedRoutes = require("./routes/feed");
const chatRoutes = require("./routes/chat");

app.set("trust proxy", true);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(cors({ allowedHeaders: "Content-Type,Authorization,language" }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,language"
  );
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");

  next();
});

app.use(languageMiddleware);

app.use("/health", (req, res) => {
  res.status(200).send({ message: "server is running" });
});

// Use the auth, user, feed, chat routes
app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/", feedRoutes);
app.use("/", chatRoutes);
// app.listen(PORT, () => {
//   console.log(`server running at: http://localhost:${PORT}`);
// });

module.exports.server = sls(app);

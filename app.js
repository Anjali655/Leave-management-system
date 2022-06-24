const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;

const app = express();

// Set up Global configuration access
// dotenv.config();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

//view engine
app.set("view engine", "ejs");

// database connection
const dbURL = "mongodb://localhost:27017/lmsdb";

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log(`Database connected`))
  .catch((err) => console.log(err));

//cookies
app.get("/set-cookies", (req, res) => {
  res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    // httpOnly: true,
  });
  res.send("You got the Cookies!");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "../views/login.html");
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

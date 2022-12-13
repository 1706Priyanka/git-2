const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

// app.use("/", (req, res) => {
//   res.send("hello");
// });
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://localhost/gitAssignment");
mongoose.connection
  .once("open", () => {
    console.log("connection established");
  })
  .on("connectionError", (err) => {
    console.log(err);
  });

dotenv.config();

app.use(express.json());
app.use("", require("./routes/user"));
app.use("", require("./routes/post"));

app.listen(3000, () => {
  console.log("server is up on port 3000");
});

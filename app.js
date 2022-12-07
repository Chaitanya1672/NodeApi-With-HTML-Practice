const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const cors = require("cors");

// db connect
mongoose
  .connect(process.env.mongUrl)
  .then((res) => console.log("daatabase connected"))
  .catch((err) => console.log("Databaes connection error"));
// db end

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const routes = require("./routes/routes");

app.use("/api", routes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`work on ${PORT}`);
  }
});

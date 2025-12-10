const express = require("express");
const mongoose = require("mongoose")
const app = express();
const cors = require("cors")
require("dotenv").config();

const GameRouter = require("./routes/gameRoutes");

app.use(express.json())
app.use(cors());

app.use("/api/games", GameRouter);

mongoose.connect("mongodb://localhost:27017/gamesdb")
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(8080, () => {
      console.log("Back start on 8080")
    })
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.get("/", (req, res) => {
  res.send("Hey Chaser")
})
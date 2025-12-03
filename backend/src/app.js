const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const router=require('./routes/user.js');
const authMiddleware = require('./middleware/authMiddleware.js');

//connection to mongodb
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("database connection error", err));

  const app = express();

  // CORS FIX
  app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true
  }));

  //middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //routes
  app.use("/api", router);


  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
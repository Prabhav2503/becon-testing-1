const express = require('express');
const cors = require('cors');
require("dotenv").config();
const router=require('./routes/user.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function checkconnection() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

checkconnection();

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
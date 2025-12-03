  const express = require("express");
  const {RegisterUser, LoginUser, HandleOTP} = require("../controller/user.js");
  const {generateToken} = require("../hooks/index.js");
  const router = express.Router();
  const {OTP, User} = require("../models/user.js");

  router.post("/signup", async (req,res) => {
    const existing = await User.findOne({email: req.body.email});
    if(existing){
      return  res.status(400).json({message: "User already exists"});
    }
      try{
        const {email} = req.body
        const response = await HandleOTP({email});
      if(!response.Success){return res.status(400).json({message: "OTP generation failed", error : response.error})}
        return res.status(201).json({message: "OTP sent successfully"});
      } catch(err) {
        return res.status(400).json({error: err.message});
      }
  })

  router.post("/verify-signup", async(req,res) => {
    const {username,email,password, otp} = req.body;
    try {
      const record = await OTP.findOne({email});
      if(!record) {
        return res.status(400).json({message: "OTP record not found"});
      }
      if(record.otp !== otp.toString()) {
        return res.status(400).json({message: "Invalid OTP"});
      }
      const user = await RegisterUser({username, email, password});
      if(!user.Success){
        return res.status(400).json({message: "User registration failed", error: user.error});
    }
    res.cookie("token", generateToken({email: email}),{
    httpOnly: true,
    secure: true,
    sameSite: "strict"
}); //setting cookie
  return res.status(201).json({message: "User registered successfully", data: user.data});
  } catch(err) {
      return res.status(500).json({message: "Server error", error: err.message});
    }});



  router.post("/login", async (req,res) => {
    const {email, password} = req.body;
    const user = await LoginUser(email, password);
    if(user.Success){
      const response = await HandleOTP(user.data);
      if(!response.Success){return res.status(400).json({message: "OTP generation failed", error : response.error})}
      return res.status(200).json({message: "OTP sent to registered email"});
    } else {
      return res.status(400).json({error: user.error});
    }
  })

  
  router.post("/verify-login", async(req,res) => {
    const {email, otp} = req.body;
    try {
        const record = await OTP.findOne({email})
        if(!record) {
            return res.status(400).json({message: "OTP record not found"});
        }
        if(record.otp !== otp.toString()) {
          return res.status(400).json({message: "Invalid OTP"});}
        res.cookie("token", generateToken({email: email}),{
    httpOnly: true,
    secure: true,
    sameSite: "strict"
}); //setting cookie
        return res.status(200).json({message: "OTP verified successfully"});
    } catch(err) {
        return res.status(500).json({message: "Server error", error: err.message});
    }
  })

  router.post("/logout", (req,res) => {
    res.clearCookie("token");
    return res.status(200).json({message: "User logged out successfully"});
  });


  module.exports = router ;
const cookieParser = require("cookie-parser");
const {verifyToken} = require("../hooks/index.js");
const express = require("express");
express().use(cookieParser());


const authMiddleware = ((req,res,next) => {
    const token = req.cookie.token;
    if(!token){
        return res.status(401).json({error: "Unauthorized"})
    }
    const user = verifyToken(token);
    if(!user){
        return res.status(401).json({error: "Invalid Token"})
    }
    req.user = user;
    next();
});

module.exports = authMiddleware;
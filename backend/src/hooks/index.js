require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secretKey = process.env.SECRETKEY;  //jwt secret key

function generateToken(payload) {
    return jwt.sign(payload, secretKey)
}

function verifyToken(token) {
    return jwt.verify(token, secretKey)
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex"); // unique salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;  // store salt and hash together
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(":");

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return hash === originalHash;
}

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

async function sendMail(to, subject, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true };
  } catch (err) {
    console.error("Error sending email:", err);
    return { success: false, error: err.message };
  }
}


module.exports = {generateToken, verifyToken,hashPassword,verifyPassword, generateOTP, sendMail};
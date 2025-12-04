
const {hashPassword, verifyPassword, generateOTP, sendMail} = require("../hooks/index.js");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//register new user in db
async function RegisterUser(body) {
  try {
    const hashedPwd = hashPassword(body.password);

    const createuser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPwd
      }
    });

    return { Success: true, data: createuser };
  } catch (err) {
    return { Success: false, error: err.message };
  }
}

// find user in db and verify password
async function LoginUser(email, password) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return { Success:false, error:"User not found" };
    if (!verifyPassword(password, user.password))
      return { Success:false, error:"Invalid password" };

    return { Success:true, data:user };

  } catch (err) {
    return { Success:false, error: err.message };
  }
}


// handle otp generation, updation in db and email sending
async function HandleOTP(user) {
  try {
    const otp = generateOTP();

    const updatedUser = await prisma.otp.upsert({
      where: { email: user.email },
      update: { otp },
      create: { email: user.email, otp }
    });

    const mailResponse = await sendMail(
      user.email,
      "OTP Verification",
      `Your OTP is: ${otp}`
    );

    if (!mailResponse.success) {
      return { Success: false, error: "Failed to send OTP email" };
    }

    return { Success: true, data: updatedUser };

  } catch (err) {
    return { Success: false, error: err.message };
  }
}


module.exports = {RegisterUser, LoginUser, HandleOTP};
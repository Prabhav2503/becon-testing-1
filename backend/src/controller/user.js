const { User, OTP } = require("../models/user.js");
const {hashPassword, verifyPassword, generateOTP, sendMail} = require("../hooks/index.js");

//register new user in db
async function RegisterUser(body) {
    try {
        const hashedPwd = hashPassword(body.password);
        const createuser = await User.create({...body, password: hashedPwd});
        return {Success: true, data: createuser}
    } catch(err) {
        return {Success: false, error: err.message}
    }
}

// find user in db and verify password
async function LoginUser(email, password){
    try {
        const user = await User.findOne({email: email});
    if(!user) {
        return ({Success:false, error: "User not found"});
    }
    if(!verifyPassword(password, user.password)) {
        return ({Success:false, error: "Invalid password"});
    }
    return {Success: true, data: user};
    } catch(err) {
        return {Success: false, error: err.message}
    }
}

// handle otp generation, updation in db and email sending
async function HandleOTP(user) {
    const otp = generateOTP();
    try {
        const updatedUser = await OTP.findOneAndUpdate(
        {email : user.email},
        {otp: otp},
        {new:true, upsert:true}
    )
    if(!updatedUser) {
        return {Success: false, error: "OTP generation/updation failed"};
    }
    const mailResponse = await sendMail(user.email, "OTP Verification", `Your OTP is: ${otp}`);
        if(!mailResponse.success) {
            return {Success: false, error: "Failed to send OTP email"};
        }
        return {Success: true, data: {updatedUser,mailResponse}};
        } catch(err) {
        return {Success: false, error: err.message}
    }
};

module.exports = {RegisterUser, LoginUser, HandleOTP};
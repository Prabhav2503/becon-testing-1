const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username :{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
  },
  {timestamps:true}
)

const OTPSchema = new mongoose.Schema(
  {
    email:{type:String, required:true},
    otp:{type: String, required:true},

  },
  {timestamps:true}
)

const User = mongoose.model('User', userSchema);
const OTP = mongoose.model('OTP', OTPSchema);

module.exports = {User, OTP};
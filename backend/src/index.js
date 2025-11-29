const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secretKey = "Prabhav";  //jwt secret key
const cors = require("cors");

//connection to mongodb
mongoose
  .connect("mongodb://localhost:27017/dummyDatabase")
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("database connection error", err));

//Schema
const FriendSchema = new mongoose.Schema(
  {
    username: { type: String, required: true }, //logged in username
    friend_name: { type: String }, //user friend name
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const frienddata = mongoose.model("Frienddata", FriendSchema);
const userdata = mongoose.model("Userdata", userSchema);

//JWT Token generation and verification
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey)
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey)
    } catch (error) {
        return null
    }
}

const app = express();
const router = express.Router();

// CORS FIX
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const authMiddleware = (req,res,next) => {
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    const user = verifyToken(token);
    if(!user){
        return res.status(401).json({message: "Invalid Token"})
    }
    req.user = user;
    next();
}

//actual data routes
router.get("/", async (req, res) => {
  //get all user friend
  const allusersdata = await frienddata.find({username: req.user.username});
  if (!allusersdata) {
    return res.status(404).send("No friends found");
  }
  res.status(200).json(allusersdata);
});

router.post("/", async (req, res) => {
  // create user friend
  const {friend_name} = req.body;
  try {
    const createfriend = await frienddata.create({username: req.user.username, friend_name});
    res
      .status(201)
      .json({ message: "Friend created successfully", ...createfriend });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message});
  }
});


//login routes
app.post("/login", async (req, res) => {
  const body = req.body;
  const user = await userdata.findOne({ username: body.username });
  req
  if (!user || user.password !== body.password) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = generateToken(body);
  res.cookie("token",token);
  const friends = await frienddata.find({username:body.username});
  return res.status(200).json({ message: "User logged in", friends,user });
});

//signup route
app.post("/signup", async (req, res) => {
  const body = req.body;
  try {
    const createuser = await userdata.create(body);
    const token = generateToken(body);
    res.cookie("token", token);
    res
      .status(201)
      .json({ message: "User created sucessfully", ...createuser._doc });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ message: "Logged out" });
});


//adding router to app with middleware
app.use("/users", authMiddleware, router);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

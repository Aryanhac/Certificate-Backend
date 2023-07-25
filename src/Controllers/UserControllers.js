const sendToken = require("../../utils/SendToken");
const User = require("../Models/UserModel");
const asyncHandler = require("../../middleware/catchAsyncError");
const error = require("../../utils/Errorhandling");
const cloudinary = require("cloudinary");

//registration
const userRegister = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const d = new Date();
  const createdAt = d.toDateString();
  const user = await User.create({
    name,
    email,
    password,
    createdAt,
  });
  sendToken(user, res, 200);
});

//logIn
const logIn = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) {
    return next(new error("username or Password is wrong", 400));
  }

  const isCorrectPassword = await user.isCorrectPassword(req.body.password);

  if (!isCorrectPassword) {
    return next(new error("username or Password is wrong", 400));
  }
  sendToken(user, res, 200);
});

//LogOut
const logOut = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "LogOut Succesfully",
    });
});

module.exports = { logIn, logOut, userRegister };

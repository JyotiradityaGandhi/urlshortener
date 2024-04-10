const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const User = require("../models/user");

const signToken = (id) => {
  token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = {};
  if (req.body.username && typeof req.body.username === "string") {
    user.username = req.body.username;
  } else {
    return next(new AppError("Missing Valid Username!", 400));
  }
  if (req.body.password && typeof req.body.password === "string") {
    user.password = req.body.password;
  } else {
    return next(new AppError("Missing Valid Password!", 400));
  }
  if (
    req.body.passwordConfirm &&
    typeof req.body.passwordConfirm === "string"
  ) {
    user.passwordConfirm = req.body.passwordConfirm;
  } else {
    return next(new AppError("Missing Valid Confirmation Password", 400));
  }
  const result = await User.create(user);
  if (!result) {
    return next(AppError("Oops! Something went wrong! Please try again", 500));
  }
  const token = signToken(result.id);
  res.status(201).json({
    status: "success",
    data: result,
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide your login credentials", 400));
  }
  if (typeof email != "string" || typeof password != "string") {
    return next(new AppError("Please provide valid login credentials", 400));
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError("User not found!", 404));
  }
  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    return next(new AppError("Please provide valid login credentials", 400));
  }
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    data: user,
    token,
  });
});


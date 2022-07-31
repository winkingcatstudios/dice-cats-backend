const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Something went wrong, database error", 500);
    return next(error);
  }

  if (!users || users.length === 0) {
    const error = new HttpError("Could not find users", 404);
    return next(error);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const postSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data",
      422
    );
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new Error("Something went wrong, database error", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new Error("Signup unsuccessful", 422);
    return next(error);
  }

  const createdUser = new User({
    name: name,
    email: email,
    image:
      "https://whatsondisneyplus.com/wp-content/uploads/2020/12/the-Ghost-of-Christmas-Present-1024x559.jpg",
    password: password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup unsuccessful", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new Error("Something went wrong, database error", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new Error("Login unsuccessful", 401);
    return next(error);
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.postSignup = postSignup;
exports.postLogin = postLogin;

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "wink",
    email: "test@test.com",
    password: "dragon",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
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

  const { name, email, password, places } = req.body;

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
    places: places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup unsuccessful", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Login unsuccessful", 401);
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.postSignup = postSignup;
exports.postLogin = postLogin;

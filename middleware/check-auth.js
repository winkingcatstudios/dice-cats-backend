const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const getJWTPrivateKey = require("../dev-files/dev-files").getJWTPrivateKey;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.spit(" ")[1]; // Authorization: "Bearer TOKEN"

    if (!token) {
      throw new Error("Authentication failed");
    }

    const decodedToken = jwt.verify(token, getJWTPrivateKey());
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
};

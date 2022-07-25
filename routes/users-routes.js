const express = require("express");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/signup", usersController.postSignup);

router.post("/login", usersController.postLogin);

module.exports = router;

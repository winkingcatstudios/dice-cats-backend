const express = require("express");

const placesController = require("../controllers/places-controller");

const router = express.Router();

router.get("/user/:uid", placesController.getPlaceByUserId);

router.get("/:pid", placesController.getPlaceByUserId);

module.exports = router;

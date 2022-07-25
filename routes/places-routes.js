const express = require("express");

const placesController = require("../controllers/places-controller");

const router = express.Router();

router.get("/user/:uid", placesController.getPlaceByUserId);

router.get("/:pid", placesController.getPlaceById);

router.post("/", placesController.postCreatePlace);

module.exports = router;

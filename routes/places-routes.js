const express = require("express");

const placesController = require("../controllers/places-controller");

const router = express.Router();

router.get("/user/:uid", placesController.getPlacesByUserId);

router.get("/:pid", placesController.getPlaceById);

router.post("/", placesController.postCreatePlace);

router.patch("/:pid", placesController.patchUpdatePlace)

router.delete("/:pid", placesController.deletePlace)

module.exports = router;

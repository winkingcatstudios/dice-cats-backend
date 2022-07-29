const express = require("express");
const { check } = require("express-validator");

const placesController = require("../controllers/places-controller");

const router = express.Router();

router.get("/user/:uid", placesController.getPlacesByUserId);

router.get("/:pid", placesController.getPlaceById);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }, { max: 500 }),
    check("address").not().isEmpty(),
  ],
  placesController.postCreatePlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }, { max: 500 }),
  ],
  placesController.patchUpdatePlace
);

router.delete("/:pid", placesController.deletePlace);

module.exports = router;

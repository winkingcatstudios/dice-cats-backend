const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Famous building",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34st, New York, NY 10001",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "Famous building",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34st, New York, NY 10001",
    creator: "u1",
  },
];

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided user id",
      404
    );
    return next(error);
  }

  res.json({ place: place });
});

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new Error("Could not find a place for the provided id", 404);
    return next(error);
  }

  res.json({ place: place });
});

module.exports = router;

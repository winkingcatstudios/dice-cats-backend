const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

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

const getPlaceByUserId = (req, res, next) => {
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
};

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new Error("Could not find a place for the provided id", 404);
    return next(error);
  }

  res.json({ place: place });
};

const postCreatePlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title: title,
    description: description,
    location: coordinates,
    address: address,
    creator: creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

exports.getPlaceByUserId = getPlaceByUserId;
exports.getPlaceById = getPlaceById;
exports.postCreatePlace = postCreatePlace;

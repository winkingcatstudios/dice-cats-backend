const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    const error = new HttpError(
      "Could not find places for the provided user id",
      404
    );
    return next(error);
  }

  res.json({ places });
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

const postCreatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

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

const patchUpdatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = {
    ...DUMMY_PLACES.find((p) => {
      return p.id === placeId;
    }),
  };

  if (!updatedPlace) {
    const error = new Error("Could not find a place for the provided id", 404);
    return next(error);
  }

  const placeIndex = DUMMY_PLACES.findIndex((p) => {
    return p.id === placeId;
  });

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for id", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Deleted place" });
};

exports.getPlacesByUserId = getPlacesByUserId;
exports.getPlaceById = getPlaceById;
exports.postCreatePlace = postCreatePlace;
exports.patchUpdatePlace = patchUpdatePlace;
exports.deletePlace = deletePlace;

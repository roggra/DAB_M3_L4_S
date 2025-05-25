const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const HotelService = require("../services/HotelService");
const db = require("../models");
const hotelService = new HotelService(db);
const { checkIfAuthorized, isAdmin } = require("./authMiddlewares");
const createError = require("http-errors");

/* GET hotels listing. */
router.get("/", async function (req, res, next) {
  const username = req.user?.username ?? 0;
  let hotels = await hotelService.get();
  console.log(req.query);
  if (req.query.location != null) {
    hotels = hotels.filter(
      (hotel) =>
        hotel.Location?.toLowerCase() == req.query.location.toLowerCase()
    );
  }
  res.render("hotels", { hotels: hotels, user: req.user, username });
});

router.get("/:hotelId", async function (req, res, next) {
  const userId = req.user?.id ?? 0;
  const username = req.user?.username ?? 0;
  const hotel = await hotelService.getHotelDetails(req.params.hotelId, userId);
  console.log(hotel);
  if (hotel.id === null) {
    return next(createError(404, "Hotel not found"));
  }
  res.render("hotelDetails", {
    hotel: hotel,
    userId,
    user: req.user,
    username,
  });
});

router.post(
  "/:hotelId/rate",
  checkIfAuthorized,
  jsonParser,
  async function (req, res, next) {
    let value = req.body.Value;
    let userId = req.body.UserId;
    await hotelService.makeARate(userId, req.params.hotelId, value);
    res.end();
  }
);

router.post(
  "/",
  checkIfAuthorized,
  isAdmin,
  jsonParser,
  async function (req, res, next) {
    let Name = req.body.Name;
    let Location = req.body.Location;
    if (Name && Location) {
      await hotelService.create(Name, Location);
    }
    res.end();
  }
);

router.delete(
  "/",
  checkIfAuthorized,
  jsonParser,
  async function (req, res, next) {
    let id = req.body.id;
    await hotelService.deleteHotel(id);
    res.end();
  }
);

router.delete(
  "/:id",
  checkIfAuthorized,
  jsonParser,
  async function (req, res, next) {
    await hotelService.deleteHotel(req.params.id);
    res.end();
  }
);

module.exports = router;

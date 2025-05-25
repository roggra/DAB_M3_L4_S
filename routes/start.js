const express = require("express");
const router = express.Router();
const db = require("../models");
const HotelService = require("../services/HotelService");
const hotelService = new HotelService(db);
const UserService = require("../services/UserService");
const userService = new UserService(db);

router.get("/", async function (req, res, next) {
  if (req.user) {
    const user = await userService.getOne(req.user.id);
    if (user === null) {
      next(createError(404));
      return;
    }
    res.render("userDetails", { user: user });
  } else {
    const rate = await hotelService.getBestRate();
    if (rate === null) {
      next(createError(404));
      return;
    }
    const hotel = await hotelService.getHotelDetails(rate.HotelId, null);
    if (hotel === null) {
      next(createError(404));
      return;
    }
    res.render("hotelDetails", {
      hotel: hotel,
      user: req.user,
      username: null,
    });
  }
});

module.exports = router;

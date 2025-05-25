const express = require("express");
const router = express.Router();
const db = require("../models");
const UserService = require("../services/UserService");
const userService = new UserService(db);
const {
  canSeeUserList,
  canSeeUserDetails,
  checkIfAuthorized,
  isAdmin,
} = require("./authMiddlewares");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const createError = require("http-errors");

/* GET users listing. */
router.get("/:userId", canSeeUserDetails, async function (req, res, next) {
  const user = await userService.getOne(req.params.userId);
  if (!user) {
    return next(createError(404, "User not found"));
  }
  res.render("userDetails", { user: user });
});

router.get("/", canSeeUserList, async function (req, res, next) {
  const users = await userService.getAll();
  res.render("users", { users: users });
});

router.delete(
  "/",
  checkIfAuthorized,
  isAdmin,
  jsonParser,
  async function (req, res, next) {
    let id = req.body.id;
    await userService.deleteUser(id);
    res.end();
  }
);

module.exports = router;

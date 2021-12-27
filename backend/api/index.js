const route = require("express").Router();

route.use("/users", require("../services/user/user.controller"));
route.use("/songs", require("../services/song/song.controller"));

// Health check
route.get("/alive", alive);
function alive(req, res, next) {
  res.send({ msg: "alive" });
}

module.exports = route;

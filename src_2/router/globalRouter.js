const express = require("express");
const routes = require("../routes");

const globalRouter = express();
const {home} = require("../controllers/globalController");

globalRouter.get(routes.home, home);

module.exports = globalRouter;
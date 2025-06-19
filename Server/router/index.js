const express = require("express");
const router = express.Router();
const ApiRoute = require("./Api");

router.use("/api", ApiRoute);

module.exports = router;

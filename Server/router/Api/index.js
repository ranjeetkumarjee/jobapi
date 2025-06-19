const express = require("express");
const router = express.Router();
const Version1 = require("./V1");

router.use("/v1", Version1);

module.exports = router;

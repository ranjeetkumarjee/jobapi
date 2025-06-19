const express = require("express");
const router = express.Router();
const {
  isAuthorize,
  isRecruiter,
  isCandidate,
} = require("../../../middlelware");

const userController = require("../../../controller/Api/V1/userController/index");

router.post("/sign-up", userController.signupUser);
router.post("/login", userController.Login);

router.post(
  "/add-jobpost",
  isAuthorize,
  isRecruiter,
  userController.createNewJob
);

router.get("/get-all-jobs", isAuthorize, userController.getTotalJobsFeed);

router.get("/get-jobs", isAuthorize, isRecruiter, userController.getAllJobPost);

router.post("/apply", isAuthorize, isCandidate, userController.ApplyJob);

module.exports = router;

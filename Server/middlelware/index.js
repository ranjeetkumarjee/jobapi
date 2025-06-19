const jwt = require("jsonwebtoken");
const { candidateData, recruiterData, jobData } = require("../modal");
async function isAuthorize(req, res, next) {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "You are unauthorize",
        success: false,
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}

async function isRecruiter(req, res, next) {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_Secret);
    console.log("Decoded", decodedToken.email);
    const logedInUser = await recruiterData.findById({
      _id: decodedToken?.userId,
    });
    // console.log("user Exist", logedInUser);
    if (!logedInUser) {
      return res.status(401).json({
        message: "You are unauthorize",
        success: false,
      });
    }
    req.user = logedInUser;
    console.log("page", req.user);
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}

async function isCandidate(req, res, next) {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    const decodedToken = jwt.decode(token);
    const logedInUser = await candidateData.findOne({
      email: decodedToken?.email,
    });
    if (!logedInUser) {
      return res.status(401).json({
        message: "You are unauthorize",
        success: false,
      });
    }
    req.user = logedInUser;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}

module.exports = { isAuthorize, isRecruiter, isCandidate };

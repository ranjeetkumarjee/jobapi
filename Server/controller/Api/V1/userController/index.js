const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { candidateData, recruiterData, jobData } = require("../../../../modal");

module.exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }

    const Model = role === "recruiter" ? recruiterData : candidateData;
    const existedUser = await Model.findOne({ email });
    if (existedUser) {
      return res.status(400).json({
        message: "User with this email already exists!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new Model({ name, email, password: hashedPassword });
    await newUser.save();

    return res
      .status(200)
      .json({ success: true, message: `${name} registered successfully` });
  } catch (error) {
    console.error("Signup Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }

    const Model = role === "recruiter" ? recruiterData : candidateData;
    const user = await Model.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found!", success: false });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Invalid password!", success: false });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    return res
      .status(200)
      .json({ token, success: true, message: "Login successful!" });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// Create New Job
module.exports.createNewJob = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;

    if (!jobTitle || !jobDescription) {
      return res
        .status(400)
        .json({ message: "Title and description required!", success: false });
    }

    const recruiter = await recruiterData.findOne({ email: req.user.email });
    if (!recruiter) {
      return res
        .status(404)
        .json({ message: "Recruiter not found!", success: false });
    }

    const newJob = new jobData({ jobTitle, jobDescription });
    await newJob.save();

    recruiter.jobPost.unshift(newJob._id);
    await recruiter.save();

    return res
      .status(200)
      .json({ message: "Job posted successfully!", success: true });
  } catch (error) {
    console.error("Job Creation Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports.getAllJobPost = async (req, res) => {
  try {
    const recruiter = await recruiterData
      .findOne({ email: req.user.email })
      .populate("jobPost");

    return res.status(200).json({
      message: "Jobs fetched successfully!",
      jobs: recruiter.jobPost,
      success: true,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports.ApplyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Job ID is required!", success: false });
    }

    const job = await jobData.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found!", success: false });
    }

    const user = await candidateData.findOne({ email: req.user.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Candidate not found!", success: false });
    }

    user.appliedJob.unshift(job._id);
    job.appiedBy.unshift(user._id);

    await user.save();
    await job.save();

    return res
      .status(200)
      .json({ message: "Job applied successfully!", success: true });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

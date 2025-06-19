const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    appiedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "candidateData",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Candidate Schema
const CandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    appliedJob: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "jobData",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Recruiter Schema
const recruiterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    jobPost: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "jobData",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const jobData = mongoose.model("jobData", jobSchema);
const candidateData = mongoose.model("candidateData", CandidateSchema);
const recruiterData = mongoose.model("recruiterData", recruiterSchema);

module.exports = { candidateData, recruiterData, jobData };

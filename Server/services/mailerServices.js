const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email,
    pass: process.env.Emailpassword,
  },
});

async function mailler({ to, subject, text, html }) {
  try {
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.Email}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Error sending mail:", error);
  }
}

module.exports = { mailler };

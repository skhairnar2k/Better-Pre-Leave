"use strict";
const nodemailer = require("nodemailer");
const { query } = require("../repo/dbRepo.js");



const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  secure: false,
  port: 587,
  auth: {
    user: "gvacharyainstitution@gmail.com",
    pass: "8qNM6pvJ42Q70EPA",
  },
});

// Function to send verification OTP to user's email
const sendOtpEmailVerify = async (email, otp) => {
  const mailOptions = {
    from: transporter.options.auth.user,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <p>Thank you for signing up with us. Please click on the following link to verify your email address:</p>
      <p>VERFICATION CODE : ${otp}</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    `,
  };


  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err.message)
    }
  })


}

// Function to notify principal about new leave application
function statusChangeLeave(email, status, personName, startDate, endDate, approveBy) {
  const mailOptions = {
    from: transporter.options.auth.user,
    to: email,
    subject: `Leave Request ${status}`,
    html: `
    <html>
      <head>
        <title>Leave Request Approved</title>
      </head>
      <body>
        <p>Dear ${personName},</p>
        <p>This email is to inform you that your leave request for ${startDate} to ${endDate} has been ${status} by ${approveBy}. We are happy to grant you the time off and hope you enjoy your break.</p>
        <p>If there are any changes to your plans or if you need to extend your leave, please inform your respective as soon as possible.</p>
        <p>If you have any questions or concerns regarding your leave request or any work-related matter, please do not hesitate to contact us.</p>
        <p>Thank you for your commitment to the college, and we wish you a pleasant break.</p>
        <p>Best regards,<br>GV Acharya Institute</p>
      </body>
    </html>
  `,
  };
  return transporter.sendMail(mailOptions);
}


module.exports = { sendOtpEmailVerify, statusChangeLeave };

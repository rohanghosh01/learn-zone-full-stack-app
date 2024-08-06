const nodemailer = require("nodemailer");
const secretJson = require("../config/config.json");
const secretEnvironment = require("../config/config.json")[
  secretJson.ENVIRONMENT
];
const config = secretEnvironment;
// Nodemailer configuration

const { SENDER_EMAIL, SENDER_EMAIL_PASSWORD } = config;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_EMAIL_PASSWORD, //generate this password from  https://myaccount.google.com/apppasswords
  },
});

const sendMail = async (email, body) => {
  let { subject, text, html } = body;
  try {
    const info = await transporter.sendMail({
      from: `Learnzone <${email}>`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(">>error send email", error);
    return false;
  }
};
module.exports = sendMail;

const router = require("express").Router();
const mongoose = require("mongoose");
const UserPin = mongoose.model("UserPin");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const { EMAIL, PASSWORD } = process.env;

//email:
router.post("/", async (req, res) => {
  //random pin generator
  const pin = Math.floor(Math.random() * 1000000);

  const { email } = req.body;

  try {
    const userPin = new UserPin({ email, pin });
    await userPin.save();
  } catch (error) {
    return res.status(422).send(error.message);
  }

  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Rabbi-Rabbit",
      link: "https://rabbi-rabbit.com/",
    },
  });

  let response = {
    body: {
      name: "Rabbi-Rabbit User",
      intro: "Password Reset: Click the button below to reset your password.",
      action: {
        instructions: `Click the button below to reset your password using this pin: ${pin}`,
        //show the pin in the email
        button: {
          color: "#33b5e5",
          text: "Reset Password",
          // link: `https://rabbi-rabbit.com/reset-password/`,
          link: "http://localhost:3000/reset-password/",
        },
      },
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: email,
    subject: "Password Reset",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        message: "you should receive an email",
      });
    })
    .catch((error) => {
      return res.status(201).json({
        message: "something went wrong",
      });
    });
});

module.exports = router;

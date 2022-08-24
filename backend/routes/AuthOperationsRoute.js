const bcrypt = require("bcryptjs");
const Joi = require("joi");
const express = require("express");

const { User } = require("../models/User");
const generateAuthToken = require("../utils/genAuthToken");

//mail imports
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists...");

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  if (!user.verified) {
    let tokenVrf = await Token.findOne({ userId: user._id });
    //email verify token
    if (!tokenVrf) {
      const tokenVrf = await new Token({
        userId: user._id,
        token: crypto.randomBytes(12).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}${user._id}/verify/${tokenVrf.token}`;
      // send verify email
      await sendEmail(user.email, "Verify Email", url);
    }
  }

  const token = generateAuthToken(user);
  // res.status(201).send({ EMail sent to your account ,please verify your email first:  });

  res.send(token);
});

module.exports = router;

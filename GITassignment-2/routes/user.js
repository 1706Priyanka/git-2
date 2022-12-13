const router = require("express").Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//register
router.post(
  "/register",
  body("email").isEmail().withMessage("enter a valid email"),
  body("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("password should be between 6 to 12 characters"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
      }

      const { email, name, password } = req.body;

      const userExists = await User.find({ email: email });
      //console.log(userExists)

      if (userExists.length) {
        return res
          .status(400)
          .json({ error: "No two users can have the same email id" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
      });

      res.status(201).json({
        status: "success",
        data: newUser,
      });
    } catch (e) {
      res.status(400).json({
        status: "failed",
        error: e.message,
      });
    }
  }
);

//login

router.post(
  "/login",
  body("email").isEmail().withMessage("enter a valid email"),
  body("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("password should be between 6 to 12 characters"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      const getUser = await User.find({ email: email });
      //console.log(userExists)

      if (getUser.length === 0) {
        return res
          .status(400)
          .json({ error: "No user with this email exists" });
      }

      const matchPassword = await bcrypt.compare(password, getUser[0].password);

      if (!matchPassword) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const payload = getUser[0]._id;

      const token = jwt.sign({ payload }, process.env.SECRET_KEY);
      res.status(201).json({
        status: "success",
        token: token,
      });
    } catch (e) {
      res.status(400).json({
        status: "failed",
        error: e.message,
      });
    }
  }
);

module.exports = router;

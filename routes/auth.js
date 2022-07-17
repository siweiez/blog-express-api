const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (request, res) => {
  try {
    // https://www.npmjs.com/package/bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(request.body.password, salt);
    const newUser = new User({
      username: request.body.username,
      email: request.body.email,
      password: hashedPass,
    });
    // save new user
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post("/login", async (request, res) => {
  try {
    // find username
    const user = await User.findOne({ username: request.body.username });
    !user && res.status(400).json("Username not exist");
    // check password
    const validated = await bcrypt.compare(request.body.password, user.password);
    !validated && res.status(400).json("Wrong password");
    // success
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
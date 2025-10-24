const { JsonWebTokenError } = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    fullName,
    role,
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "username, email, and password are required"
    });
  }

  if (!fullName || !fullName.firstName || !fullName.lastName) {
    return res.status(400).json({
      message: "fullName.firstName & lastName required"
    });
  }

  const {firstName,lastName}=fullName;
  console.log(fullName);

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "Already registered with this email or username",
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      fullName: {
        firstName,
        lastName,
      },
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "something is wrong",
      error
    });
  }
};

module.exports = {
  registerUser,
};

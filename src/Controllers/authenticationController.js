require("dotenv").config();

const AppError = require("../Helpers/AppError");
const User = require("../Models/Users");
const bcrypt = require("bcrypt");
const {
  // schema,
  // verifySignUp,
  passwordSchema,
} = require("../Helpers/validationSchema");
const jwt = require("jsonwebtoken");
const Post = require("../Models/posts");
const Review = require("../Models/reviewModel");

////////////////////////////////////get methods//////////////////////////////////

//http://localhost:3000/users

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    if (users.length == 0) return next(new AppError("Users not found"));
    res.send(users);
  } catch (error) {
    return next(error);
  }
};

//http://localhost:3000/users

const getUsersById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(new AppError("User not found"));
    res.send(user);
  } catch (error) {
    return next(error);
  }
};

////////////////////////////////////post methods//////////////////////////////////

//http://localhost:3000/users/signup

const signUp = async (req, res, next) => {
  try {
    const {
      email,
      userName,
      role,
      name,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;
    if (
      !email ||
      !userName ||
      !name ||
      !role ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    )
      return next(
        new AppError(
          "Please enter the required info" + !confirmPassword //remove it
            ? "confirmPassword"
            : ""
        )
      );
    const user = await User.findOne({ email });
    if (user) {
      return next(new AppError("user email already exists"));
    } else {
      const hashed_password = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        name,
        userName,
        role,
        phoneNumber,
        password: hashed_password,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      newUser.password = undefined;
      res.send({ newUser, token });
    }
  } catch (error) {
    return next(error);
  }
};

//http://localhost:3000/users/login

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError("Please enter the required info"));
    const user = await User.findOne({ email: email });
    if (user) {
      const isMatch = await user.checkPassword(password);
      if (!isMatch) return next(new AppError("wrong password"));
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      user.password = undefined;
      res.send({ user, token });
    } else {
      return next(new AppError("user does not exist"));
    }
  } catch (error) {
    return next(error);
  }
};

////////////////////////////////////patch methods//////////////////////////////////

//http://localhost:3000/users/update

const updatePassword = async (req, res, next) => {
  try {
    const { email, password, phoneNumber, newPassword, newConfirmPassword } =
      req.body;
    if (
      !email ||
      !password ||
      !phoneNumber ||
      !newPassword ||
      !newConfirmPassword
    )
      return next(new AppError("Please enter the required info"));
    const user = await User.findOne({ email: email });
    if (!user) return next(new AppError("user does not exist"));
    const isMatch = await user.checkPassword(password);
    if (!isMatch) return next(new AppError("wrong password"));
    try {
      await passwordSchema.validateAsync({
        password: newPassword,
        confirmPassword: newConfirmPassword,
      });
    } catch (err) {
      return next(err);
    }
    user.savePassword(newPassword);
    user.password = undefined;
    res.send(user);
  } catch (error) {
    return next(error);
  }
};

////////////////////////////////////delete methods//////////////////////////////////

//http://localhost:3000/users

const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return next(
        new AppError("please enter the email of the user you want to delete")
      );
    const user = await User.findOne({ email: email });
    if (!user) return next(new AppError("user does not exist"));
    await User.deleteOne({ email: email });

    await Post.deleteMany({ userId: user._id });
    await Review.deleteMany({ userId: user._id });

    res.send("removed user");
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUsersById,
  signUp,
  login,
  updatePassword,
  deleteUser,
  // uploadFile,
};

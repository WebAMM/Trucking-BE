//Model
const User = require("../../models/User.model");
//Responses and errors
const {
  error500,
  error409,
  error404,
  customError,
} = require("../../services/helpers/errors");
const { status200, success } = require("../../services/helpers/response");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const config = require("../../config/index");

const addUser = async (req, res, next) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body));
    const { email } = body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return error409(res, "Email already registered with platform");
    }

    await User.create({
      ...body,
    });

    return status200(res, "User created successfully");
  } catch (err) {
    return next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return error404(res, "User not found");
    }

    const passwordMatch = bcryptjs.compareSync(
      req.body.password,
      user.password
    );

    if (passwordMatch) {
      const secret = config.jwtPrivateKey;
      const token = jwt.sign(
        {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phoneNo: user.phoneNo,
          createdAt: user.createdAt,
        },
        secret,
        {
          expiresIn: "72h",
        }
      );

      const responseUser = {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        phoneNo: user.phoneNo,
        createdAt: user.createdAt,
      };

      return success(res, "200", "Login success", {
        token,
        user: responseUser,
      });
    } else {
      return customError(res, 401, "Invalid credentials");
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  addUser,
  loginUser,
};

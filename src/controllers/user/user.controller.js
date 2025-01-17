// Model
const User = require("../../models/User.model");
// Responses and errors
const {
  error500,
  error409,
  error404,
  customError,
  error400,
} = require("../../services/helpers/errors");
const { status200, success } = require("../../services/helpers/response");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const config = require("../../config/index");
const { sendOTPPasswordEmail } = require("../../services/emails/email");

// Add the user, admin add the user
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

// User login
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
        user.toObject(),
        secret,
        { expiresIn: "72h" }
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

// Generate reset password user email and OTP
const generateResetPasswordEmailWithOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      error404(res, "User not found, make sure you have an account.");
    } else {
      // Generate a 6-digit OTP
      const otp = Math.floor(1000 + Math.random() * 900000);

      // OTP expiration time in seconds
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      user.resetPassOtp = {
        code: otp,
        expiresAt: expirationTime,
      };

      await user.save();

      // sending reset password otp email
      await sendOTPPasswordEmail(email, otp);

      status200(res);
    }
  } catch (err) {
    error500(res, err);
  }
};

// Verify OTP of reset password email
const verifyResetPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Retrieve the user document from the db
    const user = await User.findOne({ email });
    console.log(new Date(), user.resetPassOtp.expiresAt);

    if (
      !user ||
      !user.resetPassOtp ||
      user.resetPassOtp.code !== otp * 1 ||
      user.resetPassOtp.expiresAt < new Date()
    ) {
      error404(res, "Invalid OTP or expired!");
    } else {
      // clearing the OTP after successful otp verification
      user.resetPassOtp = null;
      await user.save();

      success(res, "200", "OTP verified Successfully", true);
    }
  } catch (err) {
    error500(res, err);
  }
};

// Update User Password
const updateUserPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // updating password
    await User.findOneAndUpdate(
      { email: email },
      {
        password: bcryptjs.hashSync(password, 10),
      },
      { new: true }
    )
      .then((updateUser) => {
        updateUser.password = "";
        success(res, "200", "Password Updated Successfully!", updateUser);
      })
      .catch((error) => error500(res, error));
  } catch (err) {
    error500(res, err);
  }
};

// Update Password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return error400(res, "Old password and new password are required.");
    }

    if (oldPassword === newPassword) {
      return error400(res, "Old password and new password cannot be same.");
    }

    if (!(await bcryptjs.compare(oldPassword, req.user.password))) {
      return error400(res, "Old password is incorrect.");
    }

    const password = bcryptjs.hashSync(newPassword, 10);
    const updateUser = await User.findByIdAndUpdate(req.user._id, { password }, { new: true });

    success(res, "200", "Password Updated Successfully!", updateUser);
  } catch (err) {
    error500(res, err);
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { password, ...body } = req.body;

    // Prevent password from being updated in this route
    if (password) {
      return error400(res, "Password cannot be updated from here.");
    }

    const updateUser = await User.findByIdAndUpdate(req.user._id, { ...body }, { new: true });

    if (!updateUser) {
      return error404(res, "User not found.");
    }

    success(res, "200", "Profile Updated Successfully!", updateUser);
  } catch (err) {
    error500(res, err);
  }
};

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    // Default page is 1 and limit is 10 if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let filter = { createdBy: "Self" };

    if (search) {
      filter = {
        ...filter,
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phoneNo: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Fetch the users from the database
    const users = await User.find(filter)
      .select("-password -createdBy -resetPassOtp -updatedAt -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get the total number of users for pagination
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // Send the response with users and pagination info
    success(res, "200", "Users fetched successfully!", {
      pagination: {
        totalPages,
        currentPage: page,
        totalItems: totalUsers,
        itemsPerPage: limit,
      },
      users,
    });
  } catch (err) {
    error500(res, err);
  }
};

module.exports = {
  addUser,
  loginUser,
  generateResetPasswordEmailWithOTP,
  verifyResetPasswordOTP,
  updateUserPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
};

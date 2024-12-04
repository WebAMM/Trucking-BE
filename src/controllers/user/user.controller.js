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
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

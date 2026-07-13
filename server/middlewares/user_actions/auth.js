const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const ErrorHandler = require("../../utils/errorHandler");
const asyncErrorHandler = require("../helpers/asyncErrorHandler");
const { ROLES } = require("../../constants/roles");

const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new ErrorHandler("JWT_SECRET is not configured", 500);
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

const loadUserFromToken = async (token) => {
  const decodedData = verifyToken(token);
  return User.findById(decodedData.id);
};

exports.isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const user = await loadUserFromToken(token);

    if (!user) {
      return next(new ErrorHandler("Session is invalid. Please login again", 401));
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return next(error);
    }

    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Session expired. Please login again", 401));
    }

    return next(new ErrorHandler("Invalid session. Please login again", 401));
  }
});

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorHandler(
        `Role '${req.user.role}' is not authorized to access this resource`,
        403,
      ),
    );
  }

  return next();
};

exports.requireAdmin = exports.authorizeRoles(ROLES.ADMIN);

exports.attachUserIfAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next();
  }

  try {
    const user = await loadUserFromToken(token);
    if (user) {
      req.user = user;
    }
  } catch {
    // Optional auth routes ignore invalid or expired cookies.
  }

  return next();
});

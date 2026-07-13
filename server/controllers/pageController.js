const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const pages = require("../data/pages.json");

exports.getPage = asyncErrorHandler(async (req, res, next) => {
  const pageKey = req.params.key;
  const page = pages[pageKey];

  if (!page) {
    return next(new ErrorHandler("Page Not Found", 404));
  }

  res.status(200).json({
    success: true,
    page,
  });
});

exports.getPages = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    pages,
  });
});

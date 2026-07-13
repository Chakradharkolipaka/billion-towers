module.exports = {
  ...require("./authValidators"),
  ...require("./productValidators"),
  ...require("./productDetailsValidators"),
  ...require("./orderValidators"),
  ...require("./paymentValidators"),
  ...require("./pageValidators"),
  validateRequest: require("./validateRequest").validateRequest,
  ...require("./validator"),
};

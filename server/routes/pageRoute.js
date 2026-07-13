const express = require("express");
const { getPage, getPages } = require("../controllers/pageController");
const { validatePageKeyParam } = require("../middlewares/validate");

const router = express.Router();

router.route("/").get(getPages);
router.route("/:key").get(validatePageKeyParam, getPage);

module.exports = router;

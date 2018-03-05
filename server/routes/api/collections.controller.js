const express        = require("express");
const router		 = express.Router();

const User = require("../../models/user");

const genders = User.schema.path('gender').enumValues;
const cities = User.schema.path('city').enumValues;
const languages = User.schema.path('languagesOffered').options.enum;

router.get("/languages", (req, res, next) => {
	const langs = languages;
	return res.status(200).json(langs);
});

router.get("/cities", (req, res, next) => {
	return res.status(200).json(cities);
});

router.get("/genders", (req, res, next) => {
	return res.status(200).json(genders);
});

module.exports = router;

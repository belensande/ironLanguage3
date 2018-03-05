const express        = require("express");
const passport		 = require("passport");
const router		 = express.Router();
const bcrypt         = require("bcrypt");
const multer		 = require('multer');
const User			 = require("../../models/user");

router.get('/', function (req, res, next) {
	User.findById(req.user._id)
		.populate({ path: 'relations.contact petitions.contact', model: 'User' })
		.exec()
		.then(user => {
			req.user = user;
			return res.status(200).json(user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post('/accept', function (req, res, next) {
	User.update({ _id: req.user._id }, { $pull: { petitions: { contact: req.body.id } }, $addToSet: { relations: { contact: req.body.id } } }, { new: true })
		.populate({ path: 'relations.contact petitions.contact', model: 'User' })
		.exec()
		.then(user => {
			req.user = user;
			return User.update({ _id: req.body.id }, { $addToSet: { relations: { contact: req.bouserdy._id } } });
		})
		.then(result => {
			return res.status(200).json(req.user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post('/ask', function (req, res, next) {
	User.update({ _id: req.body.id }, { $addToSet: { petitions: { contact: req.user._id } } }, { new: true })
		.then(user => {
			return res.status(200).json(user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

module.exports = router;

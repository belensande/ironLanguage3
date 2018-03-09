const express        = require("express");
const passport		 = require("passport");
const router		 = express.Router();
const bcrypt         = require("bcrypt");
const multer		 = require('multer');
const User			 = require("../../models/user");
const mongoose		 = require("mongoose");

router.get('/', function (req, res, next) {
	User.findById(req.user._id)
		.populate({ path: 'relations.contact petitions', model: 'User' })
		.exec()
		.then(user => {
			req.user = user;
			return Promise.all(
				user.relations.map(rel => {
				return user.getNewMessagesFrom(rel.contact.id)
					.then(newMessages => {
						rel.set('newMessages', newMessages);
						return user.getLastUpdateWith(rel.contact.id);
					}).then(lastDate => {
						rel.set('lastUpdate', lastDate);
						return rel;
					});
				})
			);
		}).then(relations => {
			req.user.relations = relations;
			return res.status(200).json(req.user);
		}).catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post('/accept', function (req, res, next) {
	User.findByIdAndUpdate(req.body.id, { $addToSet: { relations: { contact: req.user._id } } })
		.then(user => {
			return User.findByIdAndUpdate(req.user._id, { $pull: { petitions: req.body.id }, $addToSet: { relations: { contact: req.body.id } } }, { new: true })
				.populate({ path: 'relations.contact petitions', model: 'User' })
				.exec();
		})
		.then(user => {
			req.user = user;
			return res.status(200).json(req.user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post('/ask', function (req, res, next) {
	User.update({ _id: req.body.id }, { $addToSet: { petitions: req.user._id } }, { new: true })
		.then(user => {
			return res.status(200).json(user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

module.exports = router;

const express        = require("express");
const passport		 = require("passport");
const router		 = express.Router();
const bcrypt         = require("bcrypt");
const multer		 = require('multer');
const User			 = require("../../models/user");

router.post('/accept', function (req, res, next) {
	User.update({ _id: req.user._id }, { $pull: { petitions: req.body.id }, $push: { relations: req.body.id } }, {new: true } )
	.then(user => {
		req.user = user;
		return User.update({ _id: req.body.id }, { $addToSet: { relations: req.body.id } });
	})
	.then(result => {
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

router.get('/messages', function (req, res, next) {
	User.findById(req.user._id)
		.populate({ path: 'messages.from messages.to', model: 'User' })
		.exec()
		.then(user => {
			return res.status(200).json(user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.get('/', function (req, res, next) {
	User.findById(req.user._id)
		.populate({ path: 'relations petitions', model: 'User' })
		.exec()
		.then(user => {
			req.user = user;
			return res.status(200).json(user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post('/messages/check', function (req, res, next) {
	req.user.messages = req.user.messages.map(msg => {
		if (msg.from.toString() == req.body.contact) {
			msg.checked = true;
		}
		return msg;
	});
	req.user.save()
		.then(user => {
			req.user = user;
			return res.status(200).json(user);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post('/messages/:id', function (req, res, next) {
	User.findById(req.params.id, (err, user) => {
		if (err || !user) {
			return res.status(500).json({ message: "Contact not found" });
		}

		const newMessage = {
			from: req.user._id,
			to: req.params.id,
			text: req.body.text
		};

		user.messages.push(newMessage);
		req.user.messages.push(newMessage);

		user.save()
			.then(user => {
				return req.user.save();
			})
			.then(user => {
				req.user = user;
				User.findById(req.user._id)
					.populate({ path: 'messages.from messages.to', model: 'User' })
					.exec()
					.then(user => {
						return res.status(200).json(user);
					})
					.catch(err => {
						return res.status(500).json({ message: "Somethihg went wrong" });
					});
			})
			.catch(err => {
				return res.status(500).json({ message: "Somethihg went wrong" });
			});
	});
});

module.exports = router;

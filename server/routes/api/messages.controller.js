const express        = require("express");
const router		 = express.Router();
const Message		 = require("../../models/message");
const User			 = require("../../models/user");

router.post('/check', function (req, res, next) {
	Message.updateMany({ from: req.body.contact, to: req.user._id, checked: false }, { $set: { checked: true } })
		.then(result => {
			return res.status(200).json(result);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post('/:id', function (req, res, next) {

	const newMessage = new Message({
		from: req.user._id,
		to: req.params.id,
		text: req.body.text
	});

	newMessage.save()
		.then(message => {
			return message.populate({
				path: 'from to',
				model: 'User'
			}).execPopulate();
		}).then(message => {
			return res.status(200).json(message);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.get('/news', function (req, res, next) {
	Message.count({ to: req.user._id, checked: false })
		.then(messages => {
			return res.status(200).json(messages);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.get('/:id', function (req, res, next) {
	Message.find()
		.and([
			{ $or: [{ from: req.user._id }, { to: req.user._id }] },
			{ $or: [{ from: req.params.id }, { to: req.params.id }] }
		])
		.sort({ created_at: -1 })
		.populate({ path: 'from to', model: 'User' })
		.exec()
		.then(messages => {
			return res.status(200).json(messages);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

module.exports = router;

const express        = require("express");
const router		 = express.Router();
const Message		 = require("../../models/message");
const User			 = require("../../models/user");

router.post('/check', function (req, res, next) {
	Message.updateMany({ from: req.body.contact, to: req.user._id, checked: false }, { $set: { checked: true } })
		.then(result => {
			return User.findOneAndUpdate(
				{ _id: req.user._id, 'relations.contact': req.body.contact },
				{ $set: { "relations.$.unchecked": 0 } }, { new: true });
		})
		.then(user => {
			req.user = user;
			return res.status(200).json(user);
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
			return User.findOneAndUpdate(
				{ _id: req.params.id, 'relations.contact': req.user._id },
				{ $inc: { "relations.$.unchecked": 1 }, $set: { 'relations.$.lastMessage': newMessage.created_at } }, { new: true });
		})
		.then(user => {
			return User.findOneAndUpdate(
				{ _id: req.user._id, 'relations.contact': req.params.id },
				{ $set: { 'relations.$.lastMessage': newMessage.created_at } }, { new: true });
		})
		.then(user => {
			req.user = user;
			return newMessage.populate({
				path: 'from to',
				model: 'User'
			}).execPopulate();
		})
		.then(message => {
			return res.status(200).json(message);
		})
		.catch(err => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.get('/news', function (req, res, next) {
	Message.find({ to: req.user._id, checked: false })
		.populate({ path: 'from to', model: 'User' })
		.exec()
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

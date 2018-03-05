const express		 = require("express");
const router		 = express.Router();
const Meetup		 = require("../../models/meetup");

router.post('/', function (req, res, next) {

	let meetupInfo = {
		owner: req.user._id,
		description: req.body.description,
		date: req.body.date,
		place: req.body.place,
		address: req.body.address,
		location: req.body.location,
		city: req.body.city
	};

	if (req.body.languages) {
		meetupInfo["languages"] = JSON.parse(req.body.languages);
	}

	let newMeetup = Meetup(meetupInfo);

	return newMeetup.save()
		.then(meetup => {
			return res.status(200).json(meetup);
		})
		.catch(e => {
			return res.status(500).json(e);
		});
});

router.get('/:city?', function (req, res, next) {
	let query = { date: { $gt: new Date() } };
	if (req.params.city) {
		query['city'] = req.params.city;
	}
	Meetup.find(query)
		.populate({ path: 'owner', model: 'User' })
		.exec()
		.then(meetups => {
			return res.status(200).json(meetups);
		})
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.get('/detail/:id', function (req, res, next) {
	
	Meetup.findById(req.params.id)
		.populate({ path: 'owner assist', model: 'User'})
		.exec()
		.then(meetup => {
			return res.status(200).json(meetup);
		})
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.post('/assist', function (req, res, next) {

	Meetup.findByIdAndUpdate(req.body.meetup, { $addToSet: { assist: req.body.user } }, {new: true})
		.populate({ path: 'owner assist', model: 'User' })
		.then(meetup => {
			return res.status(200).json(meetup);
		})
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.get('/:id/assist', function (req, res, next) {

	Meetup.find({ date: { $gt: new Date() }, assist: req.params.id })
		.populate({ path: 'owner assist', model: 'User' })
		.then(meetups => {
			return res.status(200).json(meetups);
		})
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.get('/:id/own', function (req, res, next) {

	Meetup.find({ date: { $gt: new Date() }, owner: req.params.id })
		.populate({ path: 'owner assist', model: 'User' })
		.then(meetups => {
			return res.status(200).json(meetups);
		})
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});
});

router.get('/messages/:id', function (req, res, next) {

	Meetup.findById(req.params.id)
		.populate({ path: 'messages.from', model: 'User' })
		.then(meetup => {
			return res.status(200).json(meetup);
		})
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.post('/messages/:id', function (req, res, next) {

	Meetup.findByIdAndUpdate(req.params.id, { $addToSet: { messages: req.body.message } }, { new: true })
		.populate({ path: 'messages.from', model: 'User' })
		.exec()
		.then(meetup => {
			return res.status(200).json(meetup);
		})
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

module.exports = router;

const express        = require("express");
const passport		 = require("passport");
const router		 = express.Router();
const bcrypt         = require("bcrypt");
const multer		 = require('multer');
const User			 = require("../../models/user");
const validation	 = require("../../middleware/validationBeforeUpload");
const cloudinary	 = require("cloudinary");

let upload = multer({
	dest: './public/images/profiles',
	fileFilter: function (req, file, cb) {
		if (!req.user) {
			return cb(new Error("Not logged"), false);
		}
		const message = validation(req);
		if (message) {
			return cb(new Error(message), false);
		}
		return cb(null, true);
	}
})

router.post("/", upload.single('file'), (req, res, next) => {

	let userInfo = {
		username: req.body.username,
		email: req.body.email,
		name: req.body.name,
		gender: req.body.gender,
		city: req.body.city,
		description: req.body.description,
		interests: req.body.interests
	};

	if (!req.file) {
		if (!req.user) {
			return cb(new Error("Not logged"), false);
		}
		let message = validation(req);
		if (message) {
			return res.status(500).json({ message });
		}
		afterUpload();
	} else {
		cloudinary.v2.uploader.upload(req.file.path, function (error, result) {
			if (error || !result) {
				return res.status(500).json({ message: "Somethihg went wrong" });
			}
			userInfo["imageUrl"] = result.secure_url;
			afterUpload();
		});
	}

	const afterUpload = () => {
		if(req.body.password != req.user.password) {
			const salt = bcrypt.genSaltSync(10);
			const hashPass = bcrypt.hashSync(userInfo.password, salt);

			userInfo["password"] = hashPass;
		}

		if (req.body.languagesOffered) {
				userInfo["languagesOffered"] = JSON.parse(req.body.languagesOffered);
			}

		if (req.body.languagesDemanded) {
				userInfo["languagesDemanded"] = JSON.parse(req.body.languagesDemanded);
			}

		User.findByIdAndUpdate(req.user.id, { $set: userInfo }, { new: true })
				.exec((err, newUser) => {
					if (err || !newUser) {
						return res.status(500).json({ message: "Somethihg went wrong" });
					}

					req.user = newUser;

					return res.status(200).json(newUser);
				});
	}

});

router.get('/:id', function (req, res, next) {
	User.findById(req.params.id).exec(
		(err, user) => {
			if (err || !user) {
				return res.status(500).json({ message: "Somethihg went wrong" });
			}
			return res.status(200).json(user);
		});
});

router.get('/', function (req, res, next) {

	User.find({}).exec(
		(err, users) => {
			if (err) {
				return res.status(500).json({ message: "Somethihg went wrong" });
			}
			return res.status(200).json(users);
		});
});

module.exports = router;

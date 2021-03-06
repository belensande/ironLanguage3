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
		let message = validation(req);
		if (message) {
			return cb(new Error(message), false);
		}
		return cb(null, true);
	}
})

let loginPromise = (req, user) => {
	return new Promise((resolve, reject) => {
		req.login(user, e => e ? reject(e) : resolve(user));
	})
}

router.post("/signup", upload.single('file'), (req, res, next) => {

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
		let hashPass = bcrypt.hashSync(req.body.password, 10);

		userInfo["password"] = hashPass;

		if (req.body.languagesOffered) {
			userInfo["languagesOffered"] = JSON.parse(req.body.languagesOffered);
		}

		if (req.body.languagesDemanded) {
			userInfo["languagesDemanded"] = JSON.parse(req.body.languagesDemanded);
		}

		let newUser = User(userInfo);

		return newUser.save()
			.then(user => loginPromise(req, user))
			.then(user => res.status(200).json(req.user))
			.catch(e => {
				return res.status(500).json({ message: 'Something went wrong' });
			});
	}
				 
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) { return res.status(500).json({ message: 'Something went wrong' }); }
		if (!user) { return res.status(401).json(info); }

		loginPromise(req, user)
			.then((user) => res.status(200).json(user))
			.catch(e => res.status(500).json({ message: 'Something went wrong' }));
	})(req, res, next);
});

router.get("/logout", (req, res, next) => {
	req.logout();
	return res.status(200).json({ message: "Success" });
});

router.get("/loggedin", (req, res) => {
	if (req.isAuthenticated()) {
		return res.status(200).json(req.user);
	} else {
		return res.status(200).json(false);
	}
});

router.get("/isadmin", (req, res) => {
	if (req.isAuthenticated()) { return res.status(200).json(req.user.role == 'Admin'); }
	return res.status(400).json({ message: 'Not logged' });
});

module.exports = router;

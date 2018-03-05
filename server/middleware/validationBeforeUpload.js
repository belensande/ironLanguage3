const User = require("../models/user");

module.exports = validationBeforeUpload = (req) => {
	if (!req.body.username || !req.body.password || !req.body.email || !req.body.name) {
		return 'Provide username, password, email and name';
	}

	User.findOne({ username: req.body.username }, '_id')
		.then(foundUsername => {
			if (foundUsername && (!req.user || req.user.id != foundUsername)) {
				return 'The username already exists';
			}

			User.findOne({ email: req.body.email }, '_id')
				.then(foundEmail => {
					if (foundEmail && (!req.user || req.user.id != foundEmail)) {
						return 'The email already exists';
					}

					return false;
				});
		})
		.catch(e => {
			return "Somethig went wrong";
		})
}
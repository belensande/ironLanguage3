const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Message = require("./message");

const relationSchema = new Schema({
	contact: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User is mandatory.']
	}
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
		toObject: {
			virtuals: true
		}
		, toJSON: {
			virtuals: true
		}
	}
)

relationSchema.virtual('newMessages')
	.get(function () {
		return this.__news;
	})
	.set(function (newMessages) {
		this.__news = newMessages;
	});

relationSchema.virtual('lastUpdate')
	.get(function () {
		return this.__last;
	})
	.set(function (lastUpdate) {
		this.__last = lastUpdate;
	});

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Username is mandatory.'],
		unique: [true, 'Username already exists.']
	},
	email: {
		type: String,
		required: [true, 'Email is mandatory.'],
		unique: [true, 'Email already exists.']
	},
	password: {
		type: String,
		required: [true, 'Password is mandatory.']
	},
	name: {
		type: String,
		required: [true, 'Name is mandatory.']
	},
	description: String,
	interests: String,
	city: {
		type: String,
		enum: ['Madrid', 'Barcelona', 'Other'],
		default: 'Other'
	},
	languagesOffered: {
		type: [String],
		enum: ["English", "French", "Spanish", "German"]
	},
	languagesDemanded: {
		type: [String],
		enum: ["English", "French", "Spanish", "German"]
	},
	gender: {
		type: String,
		enum: ['Male', 'Female']
	},
	role: {
		type: String,
		enum: ['User', 'Admin'],
		default: 'User'
	},
	imageUrl: {
		type: String,
		default: 'https://res.cloudinary.com/hbuvh6zav/image/upload/v1520410160/noimage.jpg'
	},
	relations: [relationSchema],
	petitions: {
		type: [Schema.Types.ObjectId],
		ref: 'User'
	}
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
		usePushEach: true,
		toObject: {
			virtuals: true
		}
		, toJSON: {
			virtuals: true
		}
	});

userSchema.methods.getNewMessagesFrom = function getNewMessagesFrom(contactId) {
	return Message.count({ from: contactId, to: this._id, checked: false })
		.then(news => {
			return Promise.resolve(news)
		}).catch(err => {
			return Promise.reject(err);
		});
};

userSchema.methods.getLastUpdateWith = function getLastUpdateWith(contactId) {
	return Message.findOne()
		.and([
			{ $or: [{ from: this._id }, { to: this._id }] },
			{ $or: [{ from: contactId }, { to: contactId }] }
		])
		.sort({ created_at: -1 })
		.exec()
		.then(msg => {
			return Promise.resolve(msg ? msg.created_at : '');
		}).catch(err => {
			return Promise.reject(err);
		});
};

const User = mongoose.model("User", userSchema);

module.exports = User;
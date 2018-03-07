const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
		default: '/images/profiles/noimage.jpg'
	},
	relations: [{
		contact: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User is mandatory.']
		},
		lastMessage: Date,
		unchecked: {
			type: Number,
			default: 0
		},
		created: {
			type: Date,
			default: () => new Date()
		}
	}],
	petitions: [{
		contact: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User is mandatory.']
		},
		created: {
			type: Date,
			default: () => new Date()
		}
	}]
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
		usePushEach: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
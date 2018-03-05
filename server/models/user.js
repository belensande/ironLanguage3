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
	relations: {
		type: [Schema.Types.ObjectId],
		ref: 'User'
	},
	petitions: {
		type: [Schema.Types.ObjectId],
		ref: 'User'
	},
	messages: [{
		from: {
			type: Schema.Types.ObjectId,	
			ref: 'User'
		},
		to: {
			type: Schema.Types.ObjectId,	
			ref: 'User'
		},
		text: {
			type: String,
			required: [true, 'Text is mandatory.']
		},
		created: {
			type: Date,
			default: () => new Date()
		},
		checked: {
			type: Boolean,
			default: false
		}
	}]
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
		usePushEach: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
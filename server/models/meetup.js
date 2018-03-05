const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetupSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Owner is mandatory.']
	},
	description: {
		type: String
	},
	date: {
		type: Date,
		required: [true, 'Date is mandatory.']
	},
	place: String,
	address: {
		type: String,
		required: [true, 'Adress is mandatory.']
	},
	location: {
		lat: Number,
		lng: Number
	},
	city: {
		type: String,
		enum: ['Madrid','Barcelona', 'Other'],
        default: 'Other'
	},
	languages: {
		type: [String],
		enum: ["English", "French", "Spanish", "German"]
	},
	assist: {
		type: [Schema.Types.ObjectId],
		ref: 'User'
	},
	messages: [{
		from: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Sender is mandatory.']
		},
		text: {
			type: String,
			required: [true, 'Text is mandatory.']
		},
		created: {
			type: Date,
			default: () => new Date()
		}
	}]
}, {
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Meetup = mongoose.model("Meetup", meetupSchema);

module.exports = Meetup;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetupMessageSchema = new Schema({
	meetup: {
		type: Schema.Types.ObjectId,
		ref: 'Meetup',
		required: [true, 'Meetup is mandatory.']
	},
	from: {
		type: Schema.Types.ObjectId,	
		ref: 'User',
		required: [true, 'Sender is mandatory.']
	},
	text: {
		type: String,
		required: [true, 'Text is mandatory.']
	}
}, {
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const MeetupMessage = mongoose.model("MeetupMessage", meetupMessageSchema);

module.exports = MeetupMessage;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	from: {
		type: Schema.Types.ObjectId,	
		ref: 'User',
		required: [true, 'Sender is mandatory.']
	},
	to: {
		type: Schema.Types.ObjectId,	
		ref: 'User',
		required: [true, 'Receiver is mandatory.']
	},
	text: {
		type: String,
		required: [true, 'Text is mandatory.']
	},
	checked: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	usePushEach: true
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
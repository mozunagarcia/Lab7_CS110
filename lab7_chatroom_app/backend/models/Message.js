const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  username: String,
  text: String,
  thumbsUp: { type: Number, default: 0 },
  thumbsDown: { type: Number, default: 0 }
});

const MessageSchema = new mongoose.Schema({
  roomId: String,
  username: String,
  text: String,
  thumbsUp: { type: Number, default: 0 },
  thumbsDown: { type: Number, default: 0 },
  replies: [ReplySchema]
});

module.exports = mongoose.model('Message', MessageSchema);

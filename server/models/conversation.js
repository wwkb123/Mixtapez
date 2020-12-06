var mongoose = require('mongoose');

var ConversationSchema = new mongoose.Schema({
  id: String,
  user1_id: String,
  user2_id: String,
  messages: [String],
});

module.exports = mongoose.model('conversation', ConversationSchema);
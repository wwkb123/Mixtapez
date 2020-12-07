var mongoose = require('mongoose');

// haven't used this schema yet
var MessageSchema = new mongoose.Schema({
  id: String,
  user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
  content: String
});

module.exports = mongoose.model('message', MessageSchema);
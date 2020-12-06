var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  id: String,
  user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
  content: String
});

module.exports = mongoose.model('message', MessageSchema);
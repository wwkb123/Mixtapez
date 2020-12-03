var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  id: String,
  userName: String,
  password: String,
  nickName: String,
  verified: Boolean,
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
}],
  firendRequests:[{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
}],
  nowListening: {
		  type: mongoose.Schema.Types.ObjectId,
          ref: 'music'
  },
  favourites: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'musicList'
  },
  musicLists: [
	{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'musicList'
	}
  ],
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema);
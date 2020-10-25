var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  id: String,
  userName: String,
  password: String,
  nickName: String,
  friends: [String],
  nowListening: {
		  type: think.Mongoose.Schema.Types.ObjectId,
          ref: 'music'
  },
  favourites: {
          type: think.Mongoose.Schema.Types.ObjectId,
          ref: 'musicList'
  },
  tracks: [
	{
          type: think.Mongoose.Schema.Types.ObjectId,
          ref: 'musicList'
	}
  ],
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema);
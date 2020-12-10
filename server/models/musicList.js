var mongoose = require('mongoose');

var MusicListSchema = new mongoose.Schema({
  id: String,
  musicListName: String,
  owner:{type: mongoose.Schema.Types.ObjectId,
      ref: 'user' },
  isPublic: Boolean,
  image: String,
  forkOwner:{type: mongoose.Schema.Types.ObjectId,
    ref: 'user' },
  forkFrom:{type: mongoose.Schema.Types.ObjectId,
    ref: 'musicList' },
  musics: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'music'
  }],
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('musicList', MusicListSchema);
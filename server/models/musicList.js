var mongoose = require('mongoose');

var MusicListSchema = new mongoose.Schema({
  id: String,
  trackName: String,
  musics: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'music'
  }],
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('musicList', MusicListSchema);
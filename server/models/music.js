var mongoose = require('mongoose');

var MusicSchema = new mongoose.Schema({
  id: String,
  musicName: String,
  URI: String,
  album: String,
  artist: String,
  image: String,
  length:{type: Number, default: 0},
  likes: {type: Number, default: 0},
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('music', MusicSchema);
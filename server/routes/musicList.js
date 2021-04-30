var express = require('express');
var MusicListModel = require('../models/musicList');
var MusicModel = require('../models/music');
var UserModel = require('../models/user');
var router = express.Router();

const { spotify } = require('../config');

var SpotifyWebApi = require('spotify-web-api-node');
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: spotify.clientId,
  clientSecret: spotify.clientSecret
  // accessToken: 'BQCgfkvwWeXeJqTifbjqO4Tgj4v-EP_JYoh_w2e7bN5QsCy8jN3moQssUqTHtRC9YgLf8htziHFlWt-XKXs'
});

function getNewToken(){
  // Get an access token 
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token is ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
}

getNewToken(); // get a new token when server starts

refreshTokenInterval = setInterval(getNewToken, 1000 * 60 * 30);  // refresh it every 30 minutes

// create a new playlist and return its Id
router.post('/createMusicList', async (req, res) => {
  const musicListModel = new MusicListModel({musicListName: req.body.musicListName,
                                             owner: req.body.userId,
                                             isPublic: true,
                                             lastUpdate: new Date()});
  musicListModel.save((err)=>{
    if (err) return handleError(err);
  });
  if (!musicListModel) {
      res.status(200).json({
        status: "failed"
      });
  }
  res.status(200).json({
    status: "success",
    musicListId: musicListModel._id
  });
});

// create a new playlist, with given list of musics, and return its Id
router.post('/createMusicListWithMusics', async (req, res) => {
  const musicListModel = new MusicListModel({musicListName: req.body.musicListName,
                                             musics: [...req.body.musics],
                                             owner: req.body.userId,
                                             isPublic: true,
                                             lastUpdate: new Date()});
  musicListModel.save((err)=>{
    if (err) return handleError(err);
  });
  if (!musicListModel) {
      res.status(200).json({
        status: "failed"
      });
  }
  res.status(200).json({
    status: "success",
    musicListId: musicListModel._id
  });
});

router.post('/forkMusicList', async (req, res) => {
  const originMusicList = await MusicListModel.findById(req.body.musicListId);
  if(!originMusicList){
    res.status(200).json({
      status: "failed"
    });
  }
  let forkFrom = req.body.musicListId;
  let forkOwner = originMusicList.owner;
  let musics = originMusicList.musics;
  let musicListName = originMusicList.musicListName;
  let image = originMusicList.image;
  
  const musicListModel = new MusicListModel({musicListName: musicListName,
                                             musics: musics,
                                             owner: req.body.userId,
                                             isPublic: true,
                                             image: image,
                                             forkOwner: forkOwner,
                                             forkFrom: forkFrom,
                                             lastUpdate: new Date()});
  musicListModel.save((err)=>{
    if (err) return handleError(err);
  });
  if (!musicListModel) {
      res.status(200).json({
        status: "failed"
      });
  }
  await UserModel.findOne({'_id': req.body.userId }, function (err, user) {
    if(user){
      if (err) {
          console.log("Something wrong when adding musicList "+musicListModel._id+"!");
          res.status(200).json({
            status: "error"
          });
      }
      var musicLists = user.musicLists;
      musicLists.push(musicListModel._id);
      user.musicLists = [...musicLists];
      user.save(function (err) {
        if(err) {
            console.error('ERROR!');
            res.status(200).json({
              status: "error"
            });
          }
      });
      res.status(200).json({
        status: "success",
        musicList: musicListModel
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });  
});


// create a new music and return its Id
router.post('/createMusic', async (req, res) => {
  const music = await MusicModel.find({musicName: req.body.musicName,
                                  URI: req.body.URI,
                                  album: req.body.album,
                                  artist: req.body.artist}).exec();
  if(music.length > 0){
    res.status(200).json({
      status: "success",
      musicId: music[0]._id
    });
  }
  else{
    const musicModel = new MusicModel({
                                      musicName: req.body.musicName,
                                      URI: req.body.URI,
                                      album: req.body.album,
                                      length: req.body.length,
                                      artist: req.body.artist,
                                      lastUpdate: new Date()});
    musicModel.save((err)=>{
      if (err) return handleError(err);
    });
    if (!musicModel) {
        res.status(200).json({
          status: "failed"
        });
    }
    res.status(200).json({
      status: "success",
      musicId: musicModel._id
    });
  }
});

router.post('/search/song', async (req, res) => {
  // Search songs whose name, album or artist contains req.body.search_text

  spotifyApi.searchTracks(req.body.search_text)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        results: data.body.tracks.items
      });
    }, function(err) {
      res.status(200).json({
        status: "failed"
      });
      console.error(err);
    });
});

router.post('/search/artist', async (req, res) => {
  // Search songs whose name contains req.body.search_text

  spotifyApi.searchTracks('artist:'+req.body.search_text)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        results: data.body.tracks.items
      });
    }, function(err) {
      res.status(200).json({
        status: "failed"
      });
      console.error(err);
    });
});

router.post('/search/album', async (req, res) => {
  // Search songs whose name contains req.body.search_text

  spotifyApi.searchTracks('album:'+req.body.search_text)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        results: data.body.tracks.items
      });
    }, function(err) {
      res.status(200).json({
        status: "failed"
      });
      console.error(err);
    });
});

router.post('/search/user', async (req, res) => {
  await UserModel.find({ 'nickName': { $regex: req.body.search_text, $options: "i"} }, '_id nickName', function (err, result) {
    res.status(200).json({
      status: "success",
      results: result
    });
    if (err) return handleError(err);
  });
});

router.post('/search/playlist', async (req, res) => {
  await MusicListModel.find({ 'musicListName': { $regex: req.body.search_text, $options: "i" }, isPublic: true }, function (err, result) {
    res.status(200).json({
      status: "success",
      results: result
    });
    if (err) return handleError(err);
  });
});

// return a speific playlist object of that id
router.get('/musicList/:id', async (req, res) => {
  await MusicListModel.findOne({_id: req.params.id}, function (err, musicList) {
    if(musicList){
      res.status(200).json({
        status: "success",
        musicList: musicList
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});

// return a specific music with a given music id
router.get('/music/:id', async (req, res) => {
  await MusicModel.findOne({_id: req.params.id}, function (err, music) {
    if(music){
      res.status(200).json({
        status: "success",
        music: music
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});

//change isPublic of a playlist
router.post('/setIsPublic', async (req, res) => {
  await MusicListModel.findOne({'_id': req.body.id }, function (err, musicList) {
    if(musicList){
        musicList.isPublic = req.body.isPublic;
        musicList.save(function (err) {
          if(err) {
              console.error('ERROR!');
            }
        });
        res.status(200).json({
          status: "success"
        });
      if (err) {
          console.log("Something wrong when updating playlist!");
      }
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });    
});

//append a song to a specific playlist
router.post('/addSong', async (req, res) => {
  await MusicListModel.findOne({'_id': req.body.musicListID }, function (err, musicList) {
    if(musicList){
      if (err) {
          console.log("Something wrong when add song "+req.body.songID+"!");
          res.status(200).json({
            status: "error"
          });
      }
      var musics = [];
      for(let i = 0; i < musicList.musics.length; i++){
        var id = String(musicList.musics[i]);
        musics.push(id);
      }
      if(!musics.includes(req.body.songID)){
        musics.push(req.body.songID);
      }else{
        console.log('contains this song already')
      }
      musicList.musics = [...musics];
      musicList.save(function (err) {
        if(err) {
            console.error('ERROR!');
            res.status(200).json({
              status: "error"
            });
          }
      });
      res.status(200).json({
        status: "success"
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });    
});

//append a musicListId to a specific user's musicLists
router.post('/addMusicList', async (req, res) => {
  await UserModel.findOne({'_id': req.body.userId }, function (err, user) {
    if(user){
      if (err) {
          console.log("Something wrong when adding musicList "+req.body.musicListId+"!");
          res.status(200).json({
            status: "error"
          });
      }
      var musicLists = user.musicLists;
      musicLists.push(req.body.musicListId);
      user.musicLists = [...musicLists];
      user.save(function (err) {
        if(err) {
            console.error('ERROR!');
            res.status(200).json({
              status: "error"
            });
          }
      });
      res.status(200).json({
        status: "success"
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });    
});


//remove a song from a specific playlist
router.post('/removeSong', async (req, res) => {
  await MusicListModel.update({'_id': req.body.musicListId },  { "$pull": { "musics": req.body.songID }}, { safe: true, multi:true }, function (err, musicList) {
    if(musicList){
      if (err) {
          console.log("Something wrong when removing song "+req.body.songID+"!");
          res.status(200).json({
            status: "error"
          });
      }
      res.status(200).json({
        status: "success"
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });    
});

//update a musicList's musics
router.post('/updateMusicList', async (req, res) => {
  await MusicListModel.findOne({'_id': req.body.id }, function (err, musicList) {
    if(musicList){
      if (err) {
          console.log("Something wrong when updating musiclist "+req.body.id+"!");
          res.status(200).json({
            status: "error"
          });
      }
      musicList.musics = [...req.body.musics];
      musicList.save(function (err) {
        if(err) {
            console.error('ERROR!');
          }
      });
      res.status(200).json({
        status: "success"
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });    
});

// return all playlists IDs (not the object, as the objects are not stored in User) of a user id
router.get('/user/musicLists/:id', async (req, res) => {
  await UserModel.findOne({'_id': req.params.id }, function (err, user) {
    if(user){
      res.status(200).json({
        status: "success",
        musicLists: user.musicLists
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});



// get random public playlists for homepage
router.get('/randomPlaylists', async (req, res) => {
  await MusicListModel.find({'isPublic': true}, function (err, result) {
    let n = 8;
    if(result){
      var new_result = [];
      for(let i = 0; i < result.length; i++){  // filter out empty playlists
        if(result[i]){
          if(result[i].musics){
            if(result[i].musics.length > 0){
              new_result.push(result[i]);
            }
          }
        }
      }
      result = new_result;
      if(result.length <= n){
        res.status(200).json({
          status: "success",
          playlists: result
        });
      }else{ // pick random 8
        const shuffled_array = result.sort(() => 0.5 - Math.random());
        let selected_playlists = shuffled_array.slice(0, n);
        res.status(200).json({
          status: "success",
          playlists: selected_playlists
        });
      }
    }

    if(err){
      console.log(err);
      res.status(200).json({
        status: "error",
      });
    }

  });
});

// get the audio source of a song
router.post('/getSongAudio', async (req, res) => {
  // spotifyApi
  spotifyApi.getTrack(req.body.URI).then(function(data) {
    res.status(200).json({
      status: "success",
      track: data.body
    });
  }, function(err) {
    res.status(200).json({
      status: "failed"
    });
    console.error(err);
  });
});

// update the now playing song id of a user
router.post('/updateNowPlaying', async (req, res) => {
  await UserModel.findOne({'_id': req.body.id }, function (err, user) {
    user.nowListening = req.body.musicID;
    user.save(function (err) {
      if(err) {
          console.error('ERROR!');
          res.status(200).json({
            status: "failed"
          });
        }
    });
    res.status(200).json({
      status: "success",
      user: user
    });
  });
 
});


// return a speific playlist object of that id
router.post('/updatePlaylistImage', async (req, res) => {
  await MusicListModel.findOne({_id: req.body.id}, function (err, musicList) {
    if(musicList){
      musicList.image = req.body.imageURL;
      musicList.save(function (err) {
        if(err) {
            console.error('ERROR!');
          }
      });

      res.status(200).json({
        status: "success",
        musicList: musicList
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});



module.exports = router;

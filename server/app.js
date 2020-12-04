var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/ummSchemas');
var cors = require("cors");
var nodemailer = require('nodemailer');  // to send emails

const uri = "mongodb+srv://admin:admin@cluster0.wknfy.mongodb.net/db?retryWrites=true&w=majority";
// 'mongodb://localhost/node-graphql'
mongoose.connect(uri, { promiseLibrary: require('bluebird'), useNewUrlParser: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var SpotifyWebApi = require('spotify-web-api-node');
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '9cf6f8ef5fb94f05bed2ec62cca84b4e',
  clientSecret: '80205a921f5c4360acc65c72fe03a92f'
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

var UserModel = require('./models/user');
var MusicListModel = require('./models/musicList');
var MusicModel = require('./models/music');
const { use } = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cors());
app.use('*', cors());
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mixtapez416@gmail.com',
    pass: 'mixtapez888'
  }
});

// check if an email is already registered
app.post('/api/register', async (req, res) => {
  await UserModel.find({ 'userName': req.body.email }, '_id userName', function (err, result) {
    if(result.length > 0){  // email exists
      res.status(200).json({
        status: "failed"
    });
    }else{
      res.status(200).json({
        status: "success"
    });
    }
    if (err) return handleError(err);
  })
});

// send verification email to the user
app.post('/api/sendVerifyEmail', async (req, res) => {
  var userID = "";
  await UserModel.find({ 'userName': req.body.email }, '_id userName', function (err, result) {
    console.log("send email result is ", result);
    if(result.length > 0){ // email found
      userID = result[0]._id
      var link = `http://localhost:3000/verification/${userID}`;
      console.log("preparing email...");
      var mailOptions = {
        from: 'mixtapez416@gmail.com',
        to: req.body.email,
        subject: 'Welcome to Mixtapez, please verify your email address',
        // text: 'That was easy!\nasdasd'
        html: `<h1>Thanks for registering on Mixtapez!</h1>\
        <p>To complete creating your account, please click the link below to verify your email address:</p><br>\
        <a href="${link}">Verify</a>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(200).json({
                  status: "failed"
              });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({
              status: "success",
          });
        }
      });
    }else{
      console.log("not found");
      res.status(200).json({
          status: "failed"
      });
    }
    if (err) return handleError(err);
  });
  
    
});


// verify a user after they click verify button
app.post('/api/verify', async (req, res) => {
  await UserModel.findByIdAndUpdate(req.body.id, {verified: true}, function (err, result) {
    console.log("result is ", result);
    if(result){ // user found
      console.log("user", result);
      res.status(200).json({
          status: "success",
          nickName: result.nickName,
          userId: result._id
      });
    }else{
      console.log("not found");
      res.status(200).json({
        status: "failed"
      });
    }
    if (err) return handleError(err);
  });
});

// check if sign in credentials are correct
app.post('/api/signin', async (req, res) => {
  UserModel.find({ 'userName': req.body.email }, 'nickName password verified', function (err, result) {
    console.log("result is ", result);
    if(result.length > 0){  // user exists
      // todo: make password hashed
      if(result[0].password == req.body.password){ // correct password
        if(result[0].verified){ // correct password and verified
          // const {password, ...rest} = result[0];
          // const userInfo = Object.assign({}, {...rest});
          // req.session.user = userInfo;
          res.status(200).json({
            status: "success",
            nickName: result[0].nickName,
            userId: result[0]._id
          });
        }else{ // not verified user
          res.status(200).json({
            status: "not verified",
            nickName: result[0].nickName,
            userId: result[0]._id
          });
        }
      }else{ // incorrcet password
        res.status(200).json({
          status: "failed"
        });
      }
    }else{ // no such user
      res.status(200).json({
        status: "failed"
    });
    }
    if (err) return handleError(err);
  })
});


// send email to the user to change password
app.post('/api/forgetPassword', async (req, res) => {
  var userID = "";
  await UserModel.find({ 'userName': req.body.email }, 'userName', function (err, result) {
    console.log("send email result is ", result);
    if(result.length > 0){ // email found
      userID = result[0]._id
    }else{
      console.log("not found");
    }
    if (err) return handleError(err);
  });
  if(userID !== ""){
    var link = `http://localhost:3001/changepassword/${userID}`;
    var mailOptions = {
      from: 'mixtapez416@gmail.com',
      to: req.body.email,
      subject: 'Mixtapez - Forget password',
      // text: 'That was easy!\nasdasd'
      html: `<h1>Thanks for using Mixtapez!</h1>\
      <p>To change your password, please click the link below to proceed:</p><br>\
      <a href="${link}">Change Password</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(200).json({
                status: "failed"
            });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({
            status: "success",
        });
      }
    });
  }else{ // empty ID, something is wrong
    console.log("error");
    res.status(200).json({
      status: "failed"
    });
  }
});

// verify the user's current password, and update it to a new password
app.post('/api/changePassword', async (req, res) => {
  await UserModel.findOne({'_id': req.body.id }, function (err, user) {
    if(user){
      // if(user.password === req.body.oldPassword){  // old password match
        user.password = req.body.newPassword;
        user.save(function (err) {
          if(err) {
              console.error('ERROR!');
            }
        });
        res.status(200).json({
          status: "success"
        });
      // }
      // else{  // wrong old password, don't update
      //   res.status(200).json({
      //     status: "failed"
      //   });
      // }
      if (err) {
          console.log("Something wrong when updating password!");
      }
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });    
});

// create a new playlist and return its Id
app.post('/api/createMusicList', async (req, res) => {
  const musicListModel = new MusicListModel({musicListName: req.body.musicListName,
                                             owner: req.body.userId,
                                             isPublic: true,
                                             lastUpdate: new Date()});
  console.log(musicListModel)
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
app.post('/api/createMusicListWithMusics', async (req, res) => {
  const musicListModel = new MusicListModel({musicListName: req.body.musicListName,
                                             musics: [...req.body.musics],
                                             owner: req.body.userId,
                                             isPublic: true,
                                             lastUpdate: new Date()});
  console.log(musicListModel)
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


// create a new music and return its Id
app.post('/api/createMusic', async (req, res) => {
  const music = await MusicModel.find({musicName: req.body.musicName,
                                  URI: req.body.URI,
                                  album: req.body.album,
                                  artist: req.body.artist}).exec();
  console.log(music);
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
    console.log(musicModel)
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

app.post('/api/search/song', async (req, res) => {
  // Search songs whose name, album or artist contains req.body.search_text

  spotifyApi.searchTracks(req.body.search_text)
    .then(function(data) {
      console.log("data", data)
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

app.post('/api/search/artist', async (req, res) => {
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

app.post('/api/search/album', async (req, res) => {
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

app.post('/api/search/user', async (req, res) => {
  await UserModel.find({ 'nickName': { $regex: req.body.search_text, $options: "i"} }, '_id nickName', function (err, result) {
    console.log("search user result is ", result);
    res.status(200).json({
      status: "success",
      results: result
    });
    if (err) return handleError(err);
  });
});

app.post('/api/search/playlist', async (req, res) => {
  await MusicListModel.find({ 'musicListName': { $regex: req.body.search_text, $options: "i" }, isPublic: true }, function (err, result) {
    console.log("search playlist result is ", result);
    res.status(200).json({
      status: "success",
      results: result
    });
    if (err) return handleError(err);
  });
});

// return the user object with a given id (POST)
app.post('/api/user', async (req, res) => {
  await UserModel.findOne({'_id': req.body.id }, function (err, user) {
    if(user){
      res.status(200).json({
        status: "success",
        user: user
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});

// return the user object with a given id (GET)
app.get('/api/user/:id', async (req, res) => {
  await UserModel.findOne({'_id': req.params.id }, function (err, user) {
    if(user){
      res.status(200).json({
        status: "success",
        user: user
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});


// return the nickname with a given id
app.post('/api/user/nickName', async (req, res) => {
  await UserModel.findOne({'_id': req.body.id }, 'nickName', function (err, user) {
    console.log(user);
    if(user){
      res.status(200).json({
        status: "success",
        nickName: user.nickName
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});

// return all playlists IDs (not the object, as the objects are not stored in User) of a user id
app.get('/api/user/musicLists/:id', async (req, res) => {
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


// return a speific playlist object of that id
app.get('/api/musicList/:id', async (req, res) => {
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
app.get('/api/music/:id', async (req, res) => {
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
app.post('/api/setIsPublic', async (req, res) => {
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
app.post('/api/addSong', async (req, res) => {
  await MusicListModel.findOne({'_id': req.body.musicListID }, function (err, musicList) {
    if(musicList){
      if (err) {
          console.log("Something wrong when add song "+req.body.songID+"!");
          res.status(200).json({
            status: "error"
          });
      }
      var musics = musicList.musics;
      if (musics.length>0) {
        let contains = musics.map((music)=>{
          if (music == req.body.songID) {
            return true
          } else {
            return false
          }
        }).reduce((a,b)=> {return(a||b)})
        console.log(contains)
        if (!contains) {
          musics.push(req.body.songID);
        }
      }else{
        musics.push(req.body.songID);
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
app.post('/api/addMusicList', async (req, res) => {
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
app.post('/api/removeSong', async (req, res) => {
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
app.post('/api/updateMusicList', async (req, res) => {
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

// get random public playlists for homepage
app.get('/api/randomPlaylists', async (req, res) => {
  await MusicListModel.find({'isPublic': true}, function (err, result) {
    let n = 8;
    if(result){
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
app.post('/api/getSongAudio', async (req, res) => {
  // spotifyApi
  console.log(req.body.URI)
  spotifyApi.getTrack(req.body.URI).then(function(data) {
    console.log(data.body)
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

// add a user's id (userID) to another user's (target_userID) friendRequests array
app.post('/api/sendFriendRequest', async (req, res) => {
  var user = await UserModel.findOne({'_id': req.body.userID }).exec();
  await UserModel.findOne({'_id': req.body.target_userID }, function (err, target_user) {
    var target_userID = req.body.target_userID;
    var userID = req.body.userID;
    if(target_user && user){
      var targetFriendRequests = [];
      for(let i = 0; i < target_user.friendRequests.length; i++){
        var id = String(target_user.friendRequests[i]);
        targetFriendRequests.push(id);
      }
      
      var targetFriends = [];
      for(let i = 0; i < target_user.friends.length; i++){
        var id = String(target_user.friends[i]);
        targetFriends.push(id);
      }

      var userFriendRequests = [];
      for(let i = 0; i < user.friendRequests.length; i++){
        var id = String(user.friendRequests[i]);
        userFriendRequests.push(id);
      }

      var userFriends = [];
      for(let i = 0; i < user.friends.length; i++){
        var id = String(user.friends[i]);
        userFriends.push(id);
      }

      if(userFriendRequests.includes(target_userID)){  // if self friendRequests already contains target_user's ID
        console.log("This guy ", target_userID, " already sent you a request");
        // remove id from both user's friendRequests,
        
        var indexOfTarget = userFriendRequests.indexOf(target_userID);
        if (indexOfTarget > -1) {
          userFriendRequests.splice(indexOfTarget, 1);
        }
        var indexOfUser = targetFriendRequests.indexOf(userID);
        if (indexOfUser > -1) {
          targetFriendRequests.splice(indexOfUser, 1);
        }

        // add id to both user's friends
        
        userFriends.push(target_userID);
        targetFriends.push(userID);

        user.friends = [...userFriends];
        user.friendRequests = [...userFriendRequests];
        target_user.friends = [...targetFriends];
        target_user.friendRequests = [...targetFriendRequests];

        user.save(function (err) {
          if(err) {
              console.error('ERROR!');
              res.status(200).json({
                status: "error"
              });
            }
        });

        target_user.save(function (err) {
          if(err) {
              console.error('ERROR!');
              res.status(200).json({
                status: "error"
              });
            }
        });
      }
      else if(!targetFriendRequests.includes(req.body.userID) && !targetFriends.includes(req.body.userID)){  // if the user is not a friend of target_user, and a request is not sent yet
        targetFriendRequests.push(req.body.userID);
        target_user.friendRequests = [...targetFriendRequests];
        target_user.save(function (err) {
          if(err) {
              console.error('ERROR!');
              res.status(200).json({
                status: "error"
              });
            }
        });
      }
      
      res.status(200).json({
        status: "success",
        target_user: target_user,
        user: user
      });
    }else{
      res.status(200).json({
        status: "error"
      });
    }
  });
});

// add userIDs (userID, target_userID) to both of their friends array, remove their IDs from each of their friendRequests
app.post('/api/acceptFriendRequest', async (req, res) => {
  var user = await UserModel.findOne({'_id': req.body.userID }).exec();
  await UserModel.findOne({'_id': req.body.target_userID }, function (err, target_user) {
    var target_userID = req.body.target_userID;
    var userID = req.body.userID;
    if(target_user && user){
      var targetFriendRequests = [];
      for(let i = 0; i < target_user.friendRequests.length; i++){
        var id = String(target_user.friendRequests[i]);
        targetFriendRequests.push(id);
      }
      
      var targetFriends = [];
      for(let i = 0; i < target_user.friends.length; i++){
        var id = String(target_user.friends[i]);
        targetFriends.push(id);
      }

      var userFriendRequests = [];
      for(let i = 0; i < user.friendRequests.length; i++){
        var id = String(user.friendRequests[i]);
        userFriendRequests.push(id);
      }

      var userFriends = [];
      for(let i = 0; i < user.friends.length; i++){
        var id = String(user.friends[i]);
        userFriends.push(id);
      }

      // remove id from both user's friendRequests,
        
      var indexOfTarget = userFriendRequests.indexOf(target_userID);
      if (indexOfTarget > -1) {
        userFriendRequests.splice(indexOfTarget, 1);
      }
      var indexOfUser = targetFriendRequests.indexOf(userID);
      if (indexOfUser > -1) {
        targetFriendRequests.splice(indexOfUser, 1);
      }

      // add id to both user's friends
      userFriends.push(target_userID);
      targetFriends.push(userID);

      user.friends = [...userFriends];
      user.friendRequests = [...userFriendRequests];
      target_user.friends = [...targetFriends];
      target_user.friendRequests = [...targetFriendRequests];

      user.save(function (err) {
        if(err) {
            console.error('ERROR!');
            res.status(200).json({
              status: "error"
            });
          }
      });

      target_user.save(function (err) {
        if(err) {
            console.error('ERROR!');
            res.status(200).json({
              status: "error"
            });
          }
      });

      res.status(200).json({
        status: "success",
        target_user: target_user,
        user: user
      });
    }
  });
});

// remove targetID from self friendRequests
app.post('/api/declineFriendRequest', async (req, res) => {
  await UserModel.findOne({'_id': req.body.userID }, function (err, user) {
    var target_userID = req.body.target_userID;
    if(user){
      var userFriendRequests = [];
      for(let i = 0; i < user.friendRequests.length; i++){
        var id = String(user.friendRequests[i]);
        userFriendRequests.push(id);
      }

      // remove id from both user's friendRequests,
      var indexOfTarget = userFriendRequests.indexOf(target_userID);
      if (indexOfTarget > -1) {
        userFriendRequests.splice(indexOfTarget, 1);
      }
      user.friendRequests = [...userFriendRequests];
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
        user: user
      });
    }
  });
});


// remove userIDs (userID, target_userID) from both of their friends array
app.post('/api/removeFriend', async (req, res) => {
  var user = await UserModel.findOne({'_id': req.body.userID }).exec();
  await UserModel.findOne({'_id': req.body.target_userID }, function (err, target_user) {
    var target_userID = req.body.target_userID;
    var userID = req.body.userID;
    if(target_user && user){
      var targetFriends = [];
      for(let i = 0; i < target_user.friends.length; i++){
        var id = String(target_user.friends[i]);
        targetFriends.push(id);
      }

      var userFriends = [];
      for(let i = 0; i < user.friends.length; i++){
        var id = String(user.friends[i]);
        userFriends.push(id);
      }

      // remove id from both user's friends,
        
      var indexOfTarget = userFriends.indexOf(target_userID);
      if (indexOfTarget > -1) {
        userFriends.splice(indexOfTarget, 1);
      }
      var indexOfUser = targetFriends.indexOf(userID);
      if (indexOfUser > -1) {
        targetFriends.splice(indexOfUser, 1);
      }

      user.friends = [...userFriends];
      target_user.friends = [...targetFriends];

      user.save(function (err) {
        if(err) {
            console.error('ERROR!');
            res.status(200).json({
              status: "error"
            });
          }
      });

      target_user.save(function (err) {
        if(err) {
            console.error('ERROR!');
            res.status(200).json({
              status: "error"
            });
          }
      });

      res.status(200).json({
        status: "success",
        target_user: target_user,
        user: user
      });
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// catch 401 and forward to error handler, possibly a spotify token expired error
app.use(function(req, res, next) {
  next(createError(401));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(res.statusCode === 401){
    console.log("401 error, refreshing spotify token...");
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function handleError(err){
  console.log(err);
}
module.exports = app;

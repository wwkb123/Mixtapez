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

mongoose.connect('mongodb://localhost/node-graphql', { promiseLibrary: require('bluebird'), useNewUrlParser: true })
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
// Get an access token and 'save' it using a setter
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);

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
  UserModel.find({ 'userName': req.body.email }, '_id userName', function (err, result) {
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
    }else{
      console.log("not found");
    }
    if (err) return handleError(err);
  });
  if(userID !== ""){
    var link = `http://localhost:3001/verification/${userID}`;
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
  }else{ // empty ID, something is wrong
    console.log("error");
    res.status(200).json({
      status: "failed"
    });
  }
});


// verify a user after they click verify button
app.post('/api/verify', async (req, res) => {
  await UserModel.findByIdAndUpdate(req.body.id, {verified: true}, function (err, result) {
    console.log("result is ", result);
    if(result){ // user found
      console.log("user", result);
      res.status(200).json({
          status: "success",
          nickName: result.nickName
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
      if(user.password === req.body.oldPassword){  // old password match
        user.password = req.body.newPassword;
        user.save(function (err) {
          if(err) {
              console.error('ERROR!');
            }
        });
        res.status(200).json({
          status: "success"
        });
      }else{  // wrong old password, don't update
        res.status(200).json({
          status: "failed"
        });
      }
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
  const musicListModel = new MusicListModel({musicListName: "New List",
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

app.get('/api/user', async (req, res) => {
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
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function handleError(err){
  console.log(err);
}
module.exports = app;

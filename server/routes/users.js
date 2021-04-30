var express = require('express');
var nodemailer = require('nodemailer');  // to send emails
var passwordHash = require('password-hash');  // to hash passwords
var router = express.Router();

var UserModel = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mixtapez416@gmail.com',
    pass: 'mixtapez888'
  }
});


// check if an email is already registered
router.post('/register', async (req, res) => {
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


// given a password, return the hashed string of it
router.post('/hashPassword', async (req, res) => {
  var hashedPassword = passwordHash.generate(req.body.password);
  res.status(200).json({
    status: "success",
    hashedPassword: hashedPassword
  });
});


// send verification email to the user
router.post('/sendVerifyEmail', async (req, res) => {
  var userID = "";
  await UserModel.find({ 'userName': req.body.email }, '_id userName', function (err, result) {
    if(result.length > 0){ // email found
      userID = result[0]._id
      var link = `${url.client}/verification/${userID}`;
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
router.post('/verify', async (req, res) => {
  await UserModel.findByIdAndUpdate(req.body.id, {verified: true}, function (err, result) {
    if(result){ // user found
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
router.post('/signin', async (req, res) => {
  UserModel.find({ 'userName': req.body.email }, 'nickName password verified', function (err, result) {
    if(result.length > 0){  // user exists
      if(passwordHash.verify(req.body.password, result[0].password)){ // correct password
        if(result[0].verified){ // correct password and verified
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
router.post('/forgetPassword', async (req, res) => {
  
  var user = await UserModel.find({ 'userName': req.body.email }, 'userName', function (err, result) {
    if(result.length > 0){ // email found
      userID = result[0]._id
    }else{
      console.log("not found");
    }
    if (err) return handleError(err);
  });
  if(user){
    var userID = user[0]._id;
    var link = `${url.client}/changepassword/${userID}`;
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
    console.log("error empty id in change password");
    res.status(200).json({
      status: "failed"
    });
  }
});


// verify the user's current password, and update it to a new password
router.post('/changePassword', async (req, res) => {
  await UserModel.findOne({'_id': req.body.id }, function (err, user) {
    if(user){
      // if(user.password === req.body.oldPassword){  // old password match
        var hashedPassword = passwordHash.generate(req.body.newPassword);
        user.password = hashedPassword;
        user.save(function (err) {
          if(err) {
              console.error('ERROR!');
            }
        });
        res.status(200).json({
          status: "success"
        });
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


// return the user object with a given id (POST)
router.post('/user', async (req, res) => {
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
router.get('/user/:id', async (req, res) => {
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
router.post('/user/nickName', async (req, res) => {
  await UserModel.findOne({'_id': req.body.id }, 'nickName', function (err, user) {
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


module.exports = router;

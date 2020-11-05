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

var UserModel = require('./models/user');

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

app.post('/api/sendVerifyEmail', async (req, res) => {
  UserModel.find({ 'userName': req.body.email }, '_id userName', function (err, result) {
    var userID = "";
    console.log(result);
    if(result.length > 0){ // email found
      userID = result[0]._id
    }else{
      console.log("not found");
    }
    if (err) return handleError(err);
  })

  var link = `http://localhost:3001/verification/${userID}`;
  var mailOptions = {
    from: 'mixtapez416@gmail.com',
    to: 'wwkb1233@gmail.com',
    subject: 'Welcome to Mixtapez, please verify your email address',
    // text: 'That was easy!\nasdasd'
    html: `<h1>Thanks for registering on Mixtapez!</h1>\
    <p>To complete creating your account, please click the link below to verify your email address:</p><br>\
    <a href="${link}">Verify</a>`
  };
  
  // transporter.sendMail(mailOptions, function(error, info){
    // if (error) {
    //   console.log(error);
    //   res.status(200).json({
    //           status: "failed",
    //           data: {
    //             message: "failed"
    //           }
    //       });
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //     res.status(200).json({
  //         status: "success",
  //         data: {
  //           message: "success"
  //         }
  //     });
  //   }
  // });

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

module.exports = app;

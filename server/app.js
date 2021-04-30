var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/ummSchemas');
var cors = require("cors");
const bodyParser = require("body-parser");
const { use } = require('./routes/index');
const { url, mongDB_URI } = require('./config');


// var debug = require('debug')('server:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '3001');

const uri = mongDB_URI.uri;
// 'mongodb://localhost/node-graphql'
mongoose.connect(uri, { promiseLibrary: require('bluebird'), useNewUrlParser: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var musicListRouter = require('./routes/musicList');
var friendsRouter = require('./routes/friends');



var UserModel = require('./models/user');
var MusicListModel = require('./models/musicList');
var MusicModel = require('./models/music');
var ConversationModel = require('./models/conversation');


var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(
  cors({
      origin: "*", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files

app.use(express.static(path.join(__dirname, '../client/build')));


app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({ extended: false }))

// app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/musicListRoute', musicListRouter);
app.use('/api/friendsRoute', friendsRouter);

app.use(cors());
app.use('*', cors());
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', '/index.html'));
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

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }



app.set('port', port);
var server = http.createServer(app);

server.listen(port);

// server.on('error', onError);
// server.on('listening', onListening);

const socketio = require('socket.io');
const io = socketio(server, {
  cors: {
    origin: url.client,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const online_users = [];

function userOnline(socket_id, user_id) {
  const user = { socket_id, user_id };
  online_users.push(user);

  // return user;
}

function userOnline(socket_id, user_id) {
  const user = { socket_id, user_id };
  online_users.push(user);

  // return user;
}

// User leaves chat
function userOffline(socket_id) {
  const index = online_users.findIndex(user => user.socket_id === socket_id);

  if (index !== -1) {
    return online_users.splice(index, 1)[0];
  }
}


io.on('connection', function(socket){
  console.log("made socket connection", socket.id);

  socket.on('online', ({ user_id }) => {
    console.log(user_id, "has online, socket:", socket.id);
    userOnline(socket.id, user_id);
    io.emit('online_users', online_users);
  });

  socket.on('joinRoom', ({ room }) => {
    console.log(socket.id, "has enter the chat", room)
    socket.join(room);
  });

  // socket.on('getOnlineUsers', () => {
  //   io.emit('online_users', online_users);
  // });

  socket.on('chat', function(data){
    console.log('receive chat data', data);
    // io.emit('chat', data);
    io.to(data.conversation_id).emit('chat', data.conversation_id);
  });

  // Runs when client disconnects
  socket.on('exitRoom', () => {
    console.log(socket.id, "has left the chat")
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    userOffline(socket.id);
    console.log("user with "+ socket.id +" has offline");
    io.emit('online_users', online_users);
  });

})

module.exports = app;

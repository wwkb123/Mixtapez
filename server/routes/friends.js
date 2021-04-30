var express = require('express');
var ConversationModel = require('../models/conversation');
var router = express.Router();

// add a user's id (userID) to another user's (target_userID) friendRequests array
router.post('/sendFriendRequest', async (req, res) => {
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
        // console.log("This guy ", target_userID, " already sent you a request");
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
router.post('/acceptFriendRequest', async (req, res) => {
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
router.post('/declineFriendRequest', async (req, res) => {
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
router.post('/removeFriend', async (req, res) => {
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

// get the conversation between the user and his/her friend
router.post('/getConversation', async (req, res) => {
  var conv1 = await ConversationModel.findOne({'user1_id': req.body.userID, 'user2_id': req.body.friendID}).exec();
  var conv2 = await ConversationModel.findOne({'user2_id': req.body.userID, 'user1_id': req.body.friendID}).exec();
  
  // console.log("conv1 is", conv1);
  // console.log("conv2 is", conv2);

  if(!conv1 && !conv2){  // conversation doesn't exist, create a new one
    const conversationModel = new ConversationModel(
        {
          user1_id: req.body.userID,
          user2_id: req.body.friendID,
          messages: []
        });
    conversationModel.save((err)=>{
    if (err) return handleError(err);
    });

    if (!conversationModel) {
      res.status(200).json({
        status: "failed"
      });
    }
    
    res.status(200).json({
      status: "success",
      conv_id: conversationModel._id,
      messages: conversationModel.messages
    });

  }
  if(conv1){
    res.status(200).json({
      status: "success",
      conv_id: conv1._id,
      messages: conv1.messages
    });
  }

  if(conv2){
    res.status(200).json({
      status: "success",
      conv_id: conv2._id,
      messages: conv2.messages
    });
  }

});

// append a message to the conversation between the user and his/her friend
router.post('/sendMessage', async (req, res) => {
  var conv = await ConversationModel.findOne({'_id': req.body.conversation_id}).exec();
  var message = req.body.message;

  if(conv){
    var messages = conv.messages
    messages.push(message);
    conv.messages = [...messages];
    conv.save(function (err) {
      if(err) {
          console.error('ERROR!');
        }
    });
    res.status(200).json({
      status: "success",
      conv_id: conv._id,
      messages: conv.messages
    });
  }else{
    res.status(200).json({
      status: "failed"
    });
  }
 
});

// get the messages of a conversation ID
router.post('/getMessages', async (req, res) => {
  var conv = await ConversationModel.findOne({'_id': req.body.conversation_id}).exec();

  if(conv){
    res.status(200).json({
      status: "success",
      conv_id: conv._id,
      messages: conv.messages
    });
  }else{
    res.status(200).json({
      status: "failed"
    });
  }
 
});


module.exports = router;

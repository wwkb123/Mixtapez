var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
const { graphql } = require('graphql');
var GraphQLDate = require('graphql-date');
var MusicModel = require('../models/music');
var MusicListModel = require('../models/musicList');
var UserModel = require('../models/user');


var musicType = new GraphQLObjectType({
    name: 'music',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            musicName: {
                type: GraphQLString
            },
            URI: {
                type: GraphQLString
            },
            album: {
                type: GraphQLString
            },
            artist:{
                type: GraphQLString
            },
            image:{
                type: GraphQLString
            },
            likes:{
                type: GraphQLInt
            },
            lastUpdate: {
                type: GraphQLDate
            }
        }
    }
});

var musicListType = new GraphQLObjectType({
    name: 'musicList',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            trackName: {
                type: GraphQLString
            },
            musics:{
                type: GraphQLList(musicType)
            },
            lastUpdate: {
                type: GraphQLDate
            }
        }
    }
});

var userType = new GraphQLObjectType({
    name: 'appUser',
    fields: function() {
        return {
            _id: {
                type: GraphQLString
            },
            userName: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            },
            nickName:{
                type: GraphQLString
            },
            friends:{
                type: GraphQLList(GraphQLString)
            },
            nowListening:{
                type: musicType
            },
            favourites:{
                type: GraphQLList(musicListType)
            },
            tracks:{
                type: GraphQLList(musicListType)
            },
            lastUpdate:{
                type: GraphQLDate
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            musics: {
                type: new GraphQLList(musicType),
                resolve: function () {
                    const musics = MusicModel.find().exec()
                    if (!musics) {
                        throw new Error('Error')
                    }
                    return musics
                }
            },
            music: {
                type: musicType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const musicDetails = MusicModel.findById(params.id).exec()
                    if (!musicDetails) {
                        throw new Error('Error')
                    }
                    return musicDetails
                }
            },
            musicLists:{
                type: new GraphQLList(musicListType),
                resolve: function() {
                    const musicLists = MusicListModel.find().exec()
                    if (!musicLists) {
                        throw new Error('Error')
                    }
                    return musicLists
                }
            },
            musicList: {
                type: musicListType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const musicListDetails = MusicListModel.findById(params.id).exec()
                    if (!musicListDetails) {
                        throw new Error('Error')
                    }
                    return musicListDetails
                }
            },
            users:{
                type: new GraphQLList(userType),
                resolve: function() {
                    const users = UserModel.find().exec()
                    if (!users) {
                        throw new Error('Error')
                    }
                    return users
                }
            },
            user:{
                type: userType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const userDetails = UserModel.findById(params.id).exec()
                    if (!userDetails) {
                        throw new Error('Error')
                    }
                    return userDetails
                }
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addMusic: {
                type: musicType,
                args: {
                    musicName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    URI: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    album: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    artist:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    image:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    likes:{
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    const musicModel = new MusicModel(params);
                    const newMusic = musicModel.save();
                    if (!newMusic) {
                        throw new Error('Error');
                    }
                    return newMusic
                }
            },
            updateMusic: {
                type: musicType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    musicName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    URI: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    album: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    artist:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    image:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    likes:{
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {
                    return MusicModel.findByIdAndUpdate(params.id, { musicName: params.musicName, 
                                                                    URI: params.URI, 
                                                                    album: params.album, 
                                                                    artist: params.artist,
                                                                    image: params.image,
                                                                    likes: params.likes,                        
                                                                    lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removeMusic: {
                type: musicType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remMusic = MusicModel.findByIdAndRemove(params.id).exec();
                    if (!remMusic) {
                        throw new Error('Error')
                    }
                    return remMusic;
                }
            },
            addMusicList: {
                type: musicListType,
                args: {
                    trackName: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const musicListModel = new MusicListModel(params);
                    const newMusicList = musicListModel.save();
                    if (!newMusicList) {
                        throw new Error('Error');
                    }
                    return newMusicList
                }
            },
            updateMusicList: {
                type: musicListType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    trackName: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    return MusicListModel.findByIdAndUpdate(params.id, { trackName: params.trackName, 
                                                                    lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            addMusicToMusicList: {
                type: musicListType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    musicId: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    let addedMusic = MusicModel.findById(params.musicId).exec()
                    if(!addedMusic){
                        throw new Error('error')
                    }
                    
                    return MusicListModel.findByIdAndUpdate(params.id, 
                                                            {$push:{musics: params.musicId}},
                                                            {lastUpdate: new Date()}, 
                                                            function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removeMusicFromMusicList: {
                type: musicListType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    musicId: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    let addedMusic = MusicModel.findById(params.musicId).exec()
                    if(!addedMusic){
                        throw new Error('error')
                    }
                    return MusicListModel.findByIdAndUpdate(params.id, 
                                                            {$pull:{musics: params.musicId}},
                                                            {lastUpdate: new Date()}, 
                                                            function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removeMusicList: {
                type: musicListType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remMusicList = MusicListModel.findByIdAndRemove(params.id).exec();
                    if (!remMusicList) {
                        throw new Error('Error')
                    }
                    return remMusicList;
                }
            },
            addUser:{
                type: userType,
                args:{
                    userName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    nickName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                },
                resolve: function (root, params) {
                    const userModel = new UserModel(params);
                    const newUser = userModel.save();
                    if (!newUser) {
                        throw new Error('Error');
                    }
                    return newUser
                }
            },
            updateUser: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    userName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    nickName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                },
                resolve(root, params) {
                    return MusicModel.findByIdAndUpdate(params.id, { userName: params.userName, 
                                                                    password: params.password, 
                                                                    nickName: params.nickName,                       
                                                                    lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            updateUserNowListening: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    musicId:{
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    let nowListeningMusic = MusicModel.findById(params.musicId).exec()
                    if(!nowListeningMusic){
                        throw new Error('error')
                    }
                    return MusicModel.findByIdAndUpdate(params.id, { nowListening: nowListeningMusic,                      
                                                                    lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            addNewPlaylist: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    playlistId:{
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    let playlist = MusicListModel.findById(params.playlistId).exec()
                    if(!playlist){
                        throw new Error('error')
                    }
                    return MusicModel.findByIdAndUpdate(params.id,
                                                {$push:{tracks: playlist}},  
                                                {lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removePlaylist: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    playlistId:{
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    let playlist = MusicListModel.findById(params.playlistId).exec()
                    if(!playlist){
                        throw new Error('error')
                    }
                    return MusicModel.findByIdAndUpdate(params.id,
                                                {$pull:{tracks: playlist}},  
                                                {lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removeUser: {
                type: userType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remUser = UserModel.findByIdAndRemove(params.id).exec();
                    if (!remUser) {
                        throw new Error('Error')
                    }
                    return remUser;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
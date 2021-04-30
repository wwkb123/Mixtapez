import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeScreen from './components/HomePage/HomeScreen';
import FriendScreen from './components/FriendPage/FriendScreen'
import ChatScreen from './components/FriendPage/ChatScreen';
import PlaylistsScreen from './components/PlaylistPage/PlaylistsScreen'
import NavigationBar from './components/NavigationBar.js'
import AudioPlayerBar from './components/AudioPlayerBar.js';
import CreateNewList from './components/PlaylistPage/CreateNewList.js'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


import DisplayPlaylistScreen from './components/PlaylistPage/DisplayPlaylist';
import QueueScreen from './components/QueuePage/QueueScreen';
import LikedSongsScreen from './components/LikedSongsScreen';
import SearchScreen from './components/SearchPage/SearchScreen';
import ProfileScreen from './components/ProfileScreen';

import Popup from './components/Popup';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';
import ForgetPasswordScreen from './components/ForgetPasswordScreen';
import VerificationScreen from './components/VerificationScreen';
import ChangePasswordScreen from './components/ChangePasswordScreen';
import FriendRequestsScreen from './components/FriendPage/FriendRequestsScreen';
import EmailSentScreen from './components/EmailSentScreen';
import ErrorScreen from './components/ErrorScreen';
import Banner from './components/Banner'
import UserAPI from './apis/UserAPI';

import { MdMusicNote } from "react-icons/md";
import IconButton from '@material-ui/core/IconButton';
import { IconContext } from "react-icons";

import io from "socket.io-client";
import SongDetailScreen from './components/SongDetailPage/SongDetailScreen';
import { url } from './config'

class App extends Component{
    constructor(){
        super()
        let userId = localStorage.getItem('userId');  // store to session
        let signedIn = localStorage.getItem('isSignedIn');
        let nickName = localStorage.getItem('userNickName');
        this.state = {
                        signedUp: signedIn?signedIn:false,
                        nickName: nickName?nickName:"",
                        userId: userId?userId:"",
                        musicListId: "",
                        queue: [],
                        modal_content: null,
                        main_socket: null,
                        online_users: [],
                        now_playing: "none"
                    };
    }

    updateNowPlaying = (songID) => {
        this.setState({now_playing: songID})
    }

    onModalClose = () =>{
        var modal = document.getElementById("main_modal");
        modal.style.display = "none";
    }

    connectToSocket = () => {
        if(!this.state.main_socket){
            var server_url = url.server;
            const socket = io(server_url, {
                withCredentials: true,
                extraHeaders: {
                    "my-custom-header": "abcd"
                }
            });
            this.setState({main_socket: socket}, ()=>{
                // connected to server, push online status
                if(this.state.main_socket){
                    var id = localStorage.getItem('userId');
                    this.state.main_socket.emit('online', {
                        user_id: id
                    });
                    this.state.main_socket.on('online_users', async (data) => {
                        this.setState({online_users: data});
                    });
                }
            });
        }
    }

    signedIn = async (name,id) =>{
        console.log("signed in");
        console.log(id)
        localStorage.setItem('isSignedIn', true);  // store to session
        localStorage.setItem('userId', id);
        localStorage.setItem('userNickName', name);
        var queue = localStorage.getItem('queue');
        if(!queue)
            localStorage.setItem('queue', JSON.stringify([]));
        this.connectToSocket();
        this.setState({signedUp: true,
                        nickName: name,
                        userId: id,
                        queue:[]});
    }

    signedOut = () =>{
        console.log("signed out");
        if(this.state.main_socket)
            this.state.main_socket.close();
        window.location.href = '/';
        localStorage.removeItem('isSignedIn');  // remove from session
        localStorage.removeItem('userId');
        localStorage.removeItem('userNickName');
        localStorage.removeItem('queue');
        this.setState({signedUp: false,
                        nickName: "",
                        userId: "",
                        queue:[]});
    }

    componentDidMount() {
        if(!this.state.main_socket && localStorage.getItem('isSignedIn'))
            this.connectToSocket();
    }

    componentWillUnmount() {
        if(this.state.main_socket)
            this.state.main_socket.close();
    }

    updateModalContentHandler = (content) => {
        this.setState({modal_content:content});
    }

    loadQueueSongsToAudioPlayer = (song) =>{
        this.audioPlayer.loadSongAndplay(song, 0);
    }

    loadQueueIndexToAudioPlayer = (index) => {
        this.audioPlayer.loadQueueIndexAndPlay(index);
    }

    onScrollButtonClick = () => {
        window.scrollTo(0,document.body.scrollHeight);
    }

    render(){
        return(
            <div className="primary-bg" style={{"borderTop":"15px solid #F6D8FC"}}>
                <Container style={{'height':'100vh'}}>
                    <Banner nickName={this.state.nickName}/>
                    <Row>
                        <Col xs={3}>
                            <NavigationBar 
                            userId={this.state.userId}
                            signedUp={this.state.signedUp}
                            signedOut={this.signedOut}
                            updateModalContentHandler={this.updateModalContentHandler}
                            />
                        </Col>
                        <Col xs={9} className="white-bg" style={{'height':'90vh', 'overflow':'scroll', 'overflowX': 'hidden'}}>
                            <Switch>
                                <Route exact path='/' component={HomeScreen} />
                                <Route path='/friends' render={(props) => <FriendScreen {...props} online_users={this.state.online_users} />} />
                                <Route path='/chat/:id' component={ChatScreen} />
                                <Route path='/profile/:id' render={(props) => <ProfileScreen {...props} now_playing={this.state.now_playing} updateModalContentHandler={this.updateModalContentHandler}/>} />
                                <Route path='/playlists' render={(props) => <PlaylistsScreen updateModalContentHandler={this.updateModalContentHandler} userId={this.state.userId} {...props} isAuthed={true}/>} />
                                <Route path='/playlist/:id' render={(props) => <DisplayPlaylistScreen updateMainModalContentHandler={this.updateModalContentHandler} loadQueueSongsToAudioPlayer={this.loadQueueSongsToAudioPlayer} userId={this.state.userId} {...props} isAuthed={true}/>} />
                                <Route path='/queue' render={(props) => <QueueScreen loadQueueIndexToAudioPlayer={this.loadQueueIndexToAudioPlayer} updateModalContentHandler={this.updateModalContentHandler} queue={this.state.queue} userId={this.props.userId} {...props} isAuthed={true}/>}  />
                                <Route path='/song/:id' render={(props) => <SongDetailScreen loadQueueIndexToAudioPlayer={this.loadQueueIndexToAudioPlayer} updateModalContentHandler={this.updateModalContentHandler} userId={this.props.userId} {...props} isAuthed={true}/>}  />
                                <Route path='/search' render={(props) => <SearchScreen loadQueueIndexToAudioPlayer={this.loadQueueIndexToAudioPlayer} userId={this.state.userId} {...props} isAuthed={true}/>}  />
                                <Route path='/signin'  render={(props) => <SignInScreen signedIn={this.signedIn} {...props} isAuthed={true}/>} />
                                <Route path='/signup' render={(props) => <SignUpScreen signedIn={this.signedIn} {...props} isAuthed={true}/>} />
                                <Route path='/forgetpassword' component={ForgetPasswordScreen} />
                                <Route path='/changepassword/:id' component={ChangePasswordScreen} />
                                <Route path='/verification/:id' render={(props) => <VerificationScreen signedIn={this.signedIn} {...props} isAuthed={true}/>}/>
                                <Route path='/emailsent' component={EmailSentScreen} />
                                <Route path='/error' component={ErrorScreen} />
                            </Switch>
                        </Col>
                    </Row>
                </Container>
                <div id="scroll-to-audio-right">
                    <IconButton
                        style={{'backgroundColor':'#F06E9C'}}
                        aria-label="scroll"
                        onClick={this.onScrollButtonClick}
                    >
                        <IconContext.Provider value={{ color: "white", size: '50px' }}>
                            <MdMusicNote/>
                        </IconContext.Provider>
                    </IconButton>
                </div>
                <AudioPlayerBar onRef={ref => (this.audioPlayer = ref)} updateNowPlaying={this.updateNowPlaying} />
                <div id="main_modal" className="modal">
                    <div className="modal-content">
                        <span onClick={this.onModalClose} className="close">&times;</span>
                        { this.state.modal_content }
                    </div>
                </div>
                <div id="loading_toast">Loading...</div>
                <div id="no_song_toast">This song doesn't have a preview. Playing our default song instead...</div>
                <div id="copied_toast">The link has been copied to clipboard.</div>
            </div>
        );
    }
}
export default App;


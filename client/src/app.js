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

class App extends Component{
    constructor(){
        super()
        this.state = {
                        signedUp: false,
                        nickName: "",
                        userId: "",
                        musicListId: "",
                        queue: [],
                        modal_content: null
                    };
    }

    onModalClose = () =>{
        var modal = document.getElementById("main_modal");
        modal.style.display = "none";
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
        // try{
        //     const response = await UserAPI.get("/user/"+localStorage.getItem('userId'));
        //     if(response.data.status === "success"){ // search success
        //         localStorage.setItem('user', response.data.user);
        //     }
        // }catch(err){
        //     console.log(err);
        // }
        this.setState({signedUp: true,
                        nickName: name,
                        userId: id,
                        queue:[]});
    }

    signedOut = () =>{
        console.log("signed out");
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

    updateModalContentHandler = (content) => {
        this.setState({modal_content:content});
    }

    loadQueueSongsToAudioPlayer = (URI) =>{
        this.audioPlayer.loadSongAndplay(URI, 0);
    }

    loadQueueIndexToAudioPlayer = (index) => {
        this.audioPlayer.loadQueueIndexAndPlay(index);
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
                                <Route path='/friends' component={FriendScreen} />
                                <Route path='/chat/:id' component={ChatScreen} />
                                <Route path='/profile/:id' component={ProfileScreen} />
                                {/* <Route path='/create' component={CreateNewList} /> */}
                                <Route path='/playlists' render={(props) => <PlaylistsScreen updateModalContentHandler={this.updateModalContentHandler} userId={this.state.userId} {...props} isAuthed={true}/>} />
                                <Route path='/playlist/:id' render={(props) => <DisplayPlaylistScreen updateMainModalContentHandler={this.updateModalContentHandler} loadQueueSongsToAudioPlayer={this.loadQueueSongsToAudioPlayer} userId={this.state.userId} {...props} isAuthed={true}/>} />
                                <Route path='/queue' render={(props) => <QueueScreen loadQueueIndexToAudioPlayer={this.loadQueueIndexToAudioPlayer} updateModalContentHandler={this.updateModalContentHandler} queue={this.state.queue} userId={this.props.userId} {...props} isAuthed={true}/>}  />
                                <Route path='/likedsongs' component={LikedSongsScreen} />
                                <Route path='/search' render={(props) => <SearchScreen userId={this.state.userId} {...props} isAuthed={true}/>}  />
                                {/* <Route path='/popup' component={Popup} /> */}
                                <Route path='/signin'  render={(props) => <SignInScreen signedIn={this.signedIn} {...props} isAuthed={true}/>} />
                                <Route path='/signup' render={(props) => <SignUpScreen signedIn={this.signedIn} {...props} isAuthed={true}/>} />
                                <Route path='/forgetpassword' component={ForgetPasswordScreen} />
                                <Route path='/changepassword/:id' component={ChangePasswordScreen} />
                                <Route path='/verification/:id' render={(props) => <VerificationScreen signedIn={this.signedIn} {...props} isAuthed={true}/>}/>
                                <Route path='/friendrequests' component={FriendRequestsScreen} />
                                <Route path='/emailsent' component={EmailSentScreen} />
                                <Route path='/error' component={ErrorScreen} />
                                {/* <Route path='/edit/:id' component={EditLogoScreen} />
                                <Route path='/create' component={CreateLogoScreen} />
                                <Route path='/view/:id' component={ViewLogoScreen} /> */}
                            </Switch>
                        </Col>
                    </Row>
                </Container>
                <AudioPlayerBar onRef={ref => (this.audioPlayer = ref)} />
                <div id="main_modal" className="modal">
                    <div className="modal-content">
                        <span onClick={this.onModalClose} className="close">&times;</span>
                        { this.state.modal_content }
                    </div>
                </div>
                <div id="no_song_toast">This song doesn't have a preview. Playing our default song instead...</div>
            </div>
        );
    }
}
export default App;


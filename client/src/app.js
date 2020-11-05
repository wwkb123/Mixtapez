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
import QueueScreen from './components/QueueScreen';
import LikedSongsScreen from './components/LikedSongsScreen';
import SearchScreen from './components/SearchScreen';
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

class App extends Component{
    constructor(){
        super()
        this.state = {signedUp: false,
                     nickName: ""};
    }

    signedIn = (name) =>{
        console.log("signed in");
        this.setState({signedUp: true,
                        nickName: name});
    }

    signedOut = () =>{
        console.log("signed out");
        this.setState({signedUp: false,
                        nickName: ""});
    }
    
    render(){
        return(
            <div className="primary-bg" style={{"borderTop":"15px solid #F6D8FC"}}>
                <Container>
                    <Banner nickName={this.state.nickName}/>
                    <Row>
                        <Col xs={3}>
                            <NavigationBar 
                            signedUp={this.state.signedUp}
                            signedOut={this.signedOut}
                            />
                        </Col>
                        <Col xs={9} className="white-bg">
                            <Switch>
                                <Route exact path='/' component={HomeScreen} />
                                <Route path='/friends' component={FriendScreen} />
                                <Route path='/chat/:id' component={ChatScreen} />
                                <Route path='/profile/:id' component={ProfileScreen} />
                                <Route path='/create' component={CreateNewList} />
                                <Route path='/playlists' component={PlaylistsScreen} />
                                <Route path='/playlist/:id' component={DisplayPlaylistScreen} />
                                <Route path='/queue' component={QueueScreen} />
                                <Route path='/likedsongs' component={LikedSongsScreen} />
                                <Route path='/search' component={SearchScreen} />
                                <Route path='/popup' component={Popup} />
                                <Route path='/signin' component={SignInScreen} />
                                <Route path='/signup' render={(props) => <SignUpScreen signedIn={this.signedIn} {...props} isAuthed={true}/>} />
                                <Route path='/forgetpassword' component={ForgetPasswordScreen} />
                                <Route path='/changepassword' component={ChangePasswordScreen} />
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
                <AudioPlayerBar/>
            </div>
        );
    }
}
export default App;


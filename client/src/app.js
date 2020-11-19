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
import UserAPI from './apis/UserAPI';

class App extends Component{
    constructor(){
        super()
        this.state = {signedUp: false,
                        nickName: "",
                        userId: "",
                        musicListId: "",
                        queue: []};
    }

    signedIn = async (name,id) =>{
        console.log("signed in");
        console.log(id)
        localStorage.setItem('isSignedIn', true);  // store to session
        localStorage.setItem('userId', id);
        try{
            const response = await UserAPI.get("/user/"+id);
            if(response.data.status === "success"){ // search success
                localStorage.setItem('user', response.data.user);
            }
        }catch(err){
            console.log(err);
        }
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
        localStorage.removeItem('user');
        this.setState({signedUp: false,
                        nickName: "",
                        userId: "",
                        queue:[]});
    }


    render(){
        return(
            <div className="primary-bg" style={{"borderTop":"15px solid #F6D8FC"}}>
                <Container>
                    <Banner nickName={this.state.nickName}/>
                    <Row>
                        <Col xs={3}>
                            <NavigationBar 
                            userId={this.state.userId}
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
                                <Route path='/playlists' render={(props) => <PlaylistsScreen userId={this.state.userId} {...props} isAuthed={true}/>} />
                                <Route path='/playlist/:id' render={(props) => <DisplayPlaylistScreen userId={this.state.userId} {...props} isAuthed={true}/>} />
                                <Route path='/queue' render={(props) => <QueueScreen queue={this.state.queue} userId={this.props.userId} {...props} isAuthed={true}/>}  />
                                <Route path='/likedsongs' component={LikedSongsScreen} />
                                <Route path='/search' render={(props) => <SearchScreen userId={this.state.userId} {...props} isAuthed={true}/>}  />
                                <Route path='/popup' component={Popup} />
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
                <AudioPlayerBar/>
            </div>
        );
    }
}
export default App;


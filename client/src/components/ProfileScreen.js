import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ProfilePlaylistCard from './ProfilePlaylistCard.js'
import FriendCard from './FriendPage/FriendCard.js'
import UserAPI from "../apis/UserAPI";

class ProfileScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null,
            publicPlaylists: [],
            self: null
        }
    }

    getSelf = async () => {
        var selfID = localStorage.getItem('userId');
        try {
            const response = await UserAPI.post("/user", {
                id: selfID
            });
            if(response.data.status == "success"){ // search success
                var self = response.data.user;
                this.setState({self});
            }
        }catch(err){
            console.log(err);
        }
    }

    getUser = async (id) => {
        var user = "";
        console.log("looking for user", id);
        try {
            const response = await UserAPI.post("/user", {
                id: id
            });
            if(response.data.status == "success"){ // search success
                console.log("success");
                user = response.data.user;
                
                const playlists_response = await UserAPI.get("/user/musicLists/"+user._id);
                if(playlists_response.data.status == "success"){
                    var musicLists = playlists_response.data.musicLists;  // list of playlist ids
                    var publicPlaylists = [];
                    for(let i = 0; i < musicLists.length; i++){
                        let id = musicLists[i];
                        const playlist_response = await UserAPI.get("/musicList/"+id);
                        if(playlist_response.data.status === "success"){ // search success
                            var musicList = playlist_response.data.musicList;
                            if(musicList.isPublic) // only show public playlist
                                publicPlaylists.push(musicList);
                        }else{
                            console.log("error searching playlist", id);
                        }
                    }

                    this.setState({publicPlaylists: publicPlaylists});
                    this.setState({user});
                }

            }else{ // somehow failed
                
            }
        }catch (err) {
            console.log(err);
        }
    }
    
    componentDidMount() {
        var userID = this.props.match.params.id;
        if(userID !== ""){
            this.getUser(userID);
            this.getSelf();
        }
    }

    // if only the props is updated
    componentWillReceiveProps(nextProps) {
        var userID = nextProps.match.params.id;
        if(userID !== ""){
            this.getUser(userID);
            this.getSelf();
        }
    }

    onAddFriendClick = async () => {
        var self = this.state.self;
        var user = this.state.user;

        if(self && user){
            try{
                const response = await UserAPI.post("/sendFriendRequest", {  // add self id to user's friendRequests
                    userID: self._id,
                    target_userID: user._id
                });
                if(response.data.status == "success"){
                    this.setState({user: response.data.target_user});
                    this.setState({self: response.data.user});
                }
            }catch(err){
                console.log(err);
            }
        }
    }

    onRemoveFriendClick = async () => {
        var self = this.state.self;
        var user = this.state.user;

        if(self && user){
            if(localStorage.getItem('isSignedIn')){
                var modal = document.getElementById("main_modal");
                if(modal){
                    modal.style.display = "block";
                    var updateModalContentHandler = this.props.updateModalContentHandler;
                    var content = <div>
                        <h3>Are you sure remove this friend?</h3>
                        <Button className="search-btn" onClick={(e) => this.onRemoveFriendConfirm(e, self, user)}>Confirm</Button>
                        <Button className="cancel-btn" onClick={this.closeModal}>Cancel</Button>
                        </div>
                    updateModalContentHandler(content);
                }
            }else{
                alert("Please sign in first!");
            }
        }
    }

    onRemoveFriendConfirm = async (e, self, user) => {
        try{
            const response = await UserAPI.post("/removeFriend", {  // remove a friend
                userID: self._id,
                target_userID: user._id
            });
            if(response.data.status == "success"){
                this.setState({user: response.data.target_user});
                this.setState({self: response.data.user});
            }
        }catch(err){
            console.log(err);
        }
        this.closeModal();
    }

    closeModal = () =>{
        var modal = document.getElementById("main_modal");
        modal.style.display = "none";
    }

    render() {
        var userID = this.props.match.params.id;
        var user = this.state.user;
        var self = ""
        var selfID = ""
        var playlist_cards = ""
        var user_card = ""
        var publicPlaylists = [];

        if(this.state.publicPlaylists){
            publicPlaylists = this.state.publicPlaylists;
            playlist_cards = publicPlaylists.map((playlist, index) => {
                return (<div key={index}>
                    <ProfilePlaylistCard className="grid-item" playlist={playlist}></ProfilePlaylistCard>
                </div>
                )
            })
        }
        var friend_btns = ""
        if(this.state.self && this.state.user){
            self = this.state.self;
            selfID = this.state.self._id;
            if(userID !== selfID){ // if not self
                if(self.friends.includes(userID)){  // if is a friend
                    friend_btns =
                    <div>
                        <Button onClick={this.onRemoveFriendClick} className="remove-friend-btn">Remove Friend</Button>
                    </div>
                }else{
                    friend_btns =
                    <div>
                        <Button onClick={this.onAddFriendClick} className="add-friend-btn">Add Friend</Button>
                    </div>
                }
                if(user.friendRequests.includes(selfID)){  // if request is sent
                    friend_btns =
                    <div>
                        <Button style={{'cursor':'default'}} className="pending-friend-btn">Request sent</Button>
                    </div>
                }
                
                user_card = <FriendCard user={user}/>
            }else{ // if self
                user_card = <FriendCard user={self}/>
            }
        }
        if(user){
            return (
                <div>
                    <br/>
                    <h1>Profile</h1>
                    { user_card }
                    { friend_btns }
                    <hr></hr>
                    <div className="grid-container">
                        { playlist_cards }
                    </div>
                </div>
            );
        }else{
            return <>Loading...</>
        }
    }
}

export default ProfileScreen;

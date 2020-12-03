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
            publicPlaylists: []
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
                this.setState({user});
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
        }
        
    }

    render() {
        var userID = this.props.match.params.id;
        var user = this.state.user;
        var playlist_cards = ""
        if(this.state.publicPlaylists){
            playlist_cards = this.state.publicPlaylists.map((playlist, index) => {
                return (<ProfilePlaylistCard className="grid-item" playlist={playlist}></ProfilePlaylistCard>)
            })
        }
        var friend_btns = ""
        var selfID = localStorage.getItem('userId');
        if(userID !== selfID){
            friend_btns =
            <div>
                <Button className="search-btn bg-gray">Remove Friend</Button>
            </div>
        }
        if(user){
            console.log();
            return (
                <div>
                    <br/>
                    <h1>Profile</h1>
                    <FriendCard user={user}/>
                    { friend_btns }
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

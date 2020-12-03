import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { TextField } from '@material-ui/core';
import Button from 'react-bootstrap/Button'
import UserAPI from "../../apis/UserAPI";


class ChatScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            friend: null,
            isFriend: false
        }
    }

    loadFriend = async () => {
        var userID = localStorage.getItem('userId');  // self ID
        var friendID = this.props.match.params.id;
        let friends_IDs = []
        const response = await UserAPI.post("/user", {
            id: userID
        });
        if(response.data.status == "success"){
            friends_IDs = response.data.user.friends;
        }
        if(!friends_IDs.includes(friendID)){
            return;
        }
       
        try{
            const response = await UserAPI.post("/user", {
                id: friendID
            });
            if(response.data.status == "success"){
                this.setState({friend: response.data.user});
                this.setState({isFriend: true});
            }
        }catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        this.loadFriend();
    }

    render() {
        var friendID = ""
        var friend = ""
        if(this.state.friend){
            friendID = this.state.friend._id;
            friend = this.state.friend;
        }
        if(!this.state.isFriend){
            return <div>You can't chat with a person that is not your friend.</div>
        }
        return (
            <div>
                <Link to={'/profile/' + friendID} key={friendID}>
                    <FriendCard user={friend}/>
                </Link>
                <div className="dialog-area">
                    <div className="friend-dialog">Hi How are you</div>
                    <div className="self-dialog">Good</div>
                    <div className="self-dialog">How are you</div>
                    <div className="friend-dialog">Good</div>
                </div>
                
                <div className="input-message">
                    <div style={{"verticalAlign":"middle","display":"table-cell"}}>Your Message: </div>
                    <TextField style={{"width":"90%"}} placeholder="Aa" variant="outlined" />
                    <div style={{"verticalAlign":"middle","display":"table-cell"}}>
                        <Button style={{"fontSize":"16px"}} className="nav-btn">Send</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatScreen;

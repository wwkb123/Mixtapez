import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendRequestCard from './FriendRequestCard.js'
import { Link } from 'react-router-dom';
import UserAPI from '../../apis/UserAPI.js';

class FriendRequestsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            friendRequests: [],
            isLoaded: false
        }
    }

    getFriendRequests = () => {
        var friendRequests = this.props.location.friendRequests;
        console.log(friendRequests);
        this.setState({friendRequests: friendRequests});
        this.setState({isLoaded: true});
    }

    componentDidMount() {
        this.getFriendRequests();
    }

    render() {
        var friendRequests = ""
        var friend_request_cards = ""
        if(this.state.isLoaded){
            console.log(this.state.friendRequests, this.state.friendRequests==true)
            if(this.state.friendRequests){
                friendRequests = this.state.friendRequests;
                console.log(friendRequests.length, "asd");
                if(friendRequests.length == 0){
                    friend_request_cards = <div>You have no friend requests.</div>
                }else{
                    
                    friend_request_cards = friendRequests.map((user, index) => {
                        return (<div>{user}</div>)
                    })
                }
            }
            return (
                <div>
                    <br/>
                    <h1>Friend Requests ({friendRequests.length})</h1>
                    { friend_request_cards }
                    {/* <FriendRequestCard/> */}
                </div>
            );
        }else{
            return (
                <div>
                    Loading...
                </div>
            )
        }
        
    }
}

export default FriendRequestsScreen;

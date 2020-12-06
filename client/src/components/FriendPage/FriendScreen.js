import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { Link } from 'react-router-dom';
import UserAPI from "../../apis/UserAPI";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import FriendRequestCard from './FriendRequestCard.js'

class FriendScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            friends: [],
            friendRequests: [],
            isLoaded: false,
            user: null
        }
        this.childSetFriendsAndRequest = this.childSetFriendsAndRequest.bind(this);
    }

    childSetFriendsAndRequest = (user) => {
        this.setState({user});
        this.getFriendsAndRequests();
    }

    getUser = async () => {
        var userID = localStorage.getItem('userId');
        if(userID){
            try{
                const response = await UserAPI.post("/user", {
                    id: userID
                });
                if(response.data.status === "success"){
                    this.setState({user: response.data.user});
                    this.getFriendsAndRequests();
                }
            }catch(err){

            }
        }
    }

    getFriendsAndRequests = async () => {
        var user = this.state.user;
        if(user){
            let friends_IDs = user.friends;
            let friends = [];
            for(let i = 0; i < friends_IDs.length; i++){
                const user_response = await UserAPI.post("/user", {
                    id: friends_IDs[i]
                });
                if(user_response.data.status === "success"){
                    friends.push(user_response.data.user);
                }
            }

            let friendRequests_IDs = user.friendRequests;
            let friendRequests = [];
            for(let i = 0; i < friendRequests_IDs.length; i++){
                const user_response = await UserAPI.post("/user", {
                    id: friendRequests_IDs[i]
                });
                if(user_response.data.status === "success"){
                    friendRequests.push(user_response.data.user);
                }
            }
            this.setState({friends: Array.from(friends)});
            this.setState({friendRequests:  Array.from(friendRequests)});
            this.setState({isLoaded: true});
        }
    }

    componentDidMount() {
        this.getUser();
    }

    onAccordionClick = () => {
        var accordion1 = document.getElementById("accordion1");
        if(accordion1)
            accordion1.classList.toggle("active");
        var panel = document.getElementById("friend_requests_panel");
        if(panel){
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        }
    }

    render() {
        let friend_cards = ""
        let friendRequests = ""
        let friend_request_cards = ""
        if(this.state.isLoaded){
            if(this.state.friends){
                if(this.state.friends.length === 0){
                    friend_cards = <div>You have no friend yet. Go to search page and search for users.</div>
                }else{
                    friend_cards = this.state.friends.map((user, index) => {
                        return (<div key={index}>
                            <Link to={"/chat/"+user._id}>
                                <FriendCard user={user}></FriendCard>
                            </Link>
                        </div>)
                    })
                }
                
            }
            if(this.state.friendRequests){
                friendRequests = this.state.friendRequests;
                if(friendRequests.length === 0){
                    friend_request_cards = <div>You have no friend requests.</div>
                }else{
                    friend_request_cards = friendRequests.map((user, index) => {
                        return (
                            <div key={index}>
                                <FriendRequestCard
                                childSetFriendsAndRequest={this.childSetFriendsAndRequest}
                                user={user}
                                >
                                </FriendRequestCard>
                            </div>
                        
                        )
                    })
                }
            }
            return (
                <div>
                    <br/>
                    <h1>Friends</h1>
                    <button className="accordion" id="accordion1" onClick={this.onAccordionClick}>
                        <Row>
                            <Col xs={11}>
                                <h4>Friend Requests ({friendRequests.length})</h4>
                            </Col>
                            <Col xs={1}>
                                <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                                    <BsFillCaretDownFill/>
                                </IconContext.Provider>
                            </Col>
                        </Row>
                    </button>
                    <div className="panel" id="friend_requests_panel">
                        {friend_request_cards}
                    </div>
                    <hr></hr>
                    { friend_cards }
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

export default FriendScreen;

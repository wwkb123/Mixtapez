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
            user: null,
            online_friends: [],
            offline_friends: []
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
            this.setState({friends: Array.from(friends)}, () => {
                if(this.props.online_users && this.props.online_users.length > 0){
                    let online_users = this.props.online_users;
                    this.updateOnlineFriends(online_users);
                }
            });
            this.setState({friendRequests:  Array.from(friendRequests)});
            this.setState({isLoaded: true});
        }
    }

    updateOnlineFriends = (online_users) =>{
        // console.log('friend screen online users is', online_users);
        
        if(this.state.friends && this.state.friends.length > 0){

            var online_users_ids = [];
            for(let i = 0; i < online_users.length; i++){  // extract only the user_ids
                if(online_users[i])
                    online_users_ids.push(online_users[i].user_id)
            }

            var online_friends = [];
            var offline_friends = [];

            for(let i = 0; i < this.state.friends.length; i++){
                if(this.state.friends[i]){
                    if(online_users_ids.includes(this.state.friends[i]._id)){  // put friends in online_users to online friends
                        online_friends.push(this.state.friends[i]);
                    }else{  // otherwise put to offline friends
                        offline_friends.push(this.state.friends[i]);
                    }
                }
            }
            // console.log("online friends", online_friends);
            // console.log("offline friends", offline_friends);
            this.setState({online_friends});
            this.setState({offline_friends});
        }
    }

    componentDidMount() {
        this.getUser();
        // console.log("props is", this.props)
        
    }

    componentWillUnmount() {
        // this.props.onRef(undefined)
    }

    // if only the props is updated
    componentWillReceiveProps(nextProps) {
        // console.log("new props is", nextProps)
        if(nextProps.online_users && nextProps.online_users.length > 0){
            let online_users = nextProps.online_users;
            this.updateOnlineFriends(online_users);
        }
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
        let online_friend_cards = ""
        let offline_friend_cards = ""
        let friend_cards = ""
        let friendRequests = ""
        let friend_request_cards = ""
        if(this.state.isLoaded){
            if(this.state.friends){
                if(this.state.friends.length === 0){
                    friend_cards = <div>You have no friend yet. Go to search page and search for users.</div>
                }else{
                    var online_num = 0;
                    if(this.state.online_friends){
                        online_num = this.state.online_friends.length;
                    }
                    var online_title = <h2>Online Friends ({online_num})</h2>
                    online_friend_cards = this.state.online_friends.map((user, index) => {
                        return (<div key={index}>
                            <Link to={"/chat/"+user._id}>
                                <FriendCard user={user}></FriendCard>
                            </Link>
                        </div>)
                    })

                    var offline_num = 0;
                    if(this.state.offline_friends){
                        offline_num = this.state.offline_friends.length;
                    }
                    var offline_title = <h2 style={{'color':'#ACACAC'}}>Offline Friends ({offline_num})</h2>
                    offline_friend_cards = this.state.offline_friends.map((user, index) => {
                        return (<div key={index}>
                            <Link to={"/chat/"+user._id}>
                                <FriendCard isOffline={true} user={user}></FriendCard>
                            </Link>
                        </div>)
                    })

                    friend_cards = 
                    <div>
                        { online_title }
                        { online_friend_cards }
                        <hr/>
                        { offline_title }
                        { offline_friend_cards }
                    </div>
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

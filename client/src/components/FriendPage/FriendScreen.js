import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { Link } from 'react-router-dom';
import data from '../Mixtapez_data.json'
import UserAPI from "../../apis/UserAPI";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { IconContext } from "react-icons";

class FriendScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            friends: [],
            friendRequests: [],
            isLoaded: false
        }
    }

    getFriendsAndRequests = async () => {
        var userID = localStorage.getItem('userId');
        if(userID){
            try{
                const response = await UserAPI.post("/user", {
                    id: userID
                });
                if(response.data.status == "success"){
                    this.setState({friends: response.data.user.friends});
                    this.setState({friendRequests: response.data.user.friendRequests});
                    // console.log(response.data.user);
                }
                this.setState({isLoaded: true});
            }catch(err){
                console.log(err);
            }
        }
        
    }

    componentDidMount() {
        this.getFriendsAndRequests();
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
        var friend_cards = ""
        var friendRequests = ""
        var friend_request_cards = ""
        if(this.state.isLoaded){
            if(this.state.friends){
                if(this.state.friends.length == 0){
                    friend_cards = <div>You have no friend yet. Go to search page and search for users.</div>
                }else{
                    friend_cards = this.state.friends.map((friend, index) => {
                        return (<div>{friend}</div>)
                    })
                }
                
            }
            if(this.state.friendRequests){
                friendRequests = this.state.friendRequests;
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
                    {/* <Link to="/chat/1"><FriendCard name={data.users[1].nickName}/></Link>
                    <FriendCard name={data.users[2].nickName}/> */}
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

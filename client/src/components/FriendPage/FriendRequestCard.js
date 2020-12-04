import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsPersonSquare } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import UserAPI from "../../apis/UserAPI";

class FriendRequestCard extends Component {
    onAcceptClick = async () => {
        var target_userID = "";
        var selfID = localStorage.getItem('userId');  // self ID
        if(this.props.user){
            target_userID = this.props.user._id;
        }
        if(target_userID && selfID){
            try{
                const response = await UserAPI.post("/acceptFriendRequest", {
                    userID: selfID,
                    target_userID: target_userID
                });
                if(response.data.status == "success"){
                    // set parent's state
                    var user = response.data.user;
                    var childSetFriendsAndRequest = this.props.childSetFriendsAndRequest;
                    if(childSetFriendsAndRequest){
                        childSetFriendsAndRequest(user);
                    }
                }
            }catch(err){
                console.log(err);
            }  
        }
    }

    onDeclineClick = () => {

    }

    render() {
        var username = ""
        var userID = ""
        if(this.props.user){
            username = this.props.user.nickName;
            userID = this.props.user._id;
        }
        return (
            <div className="m-5">
                <Container>
                    <Row>
                        <Col xs={3} className="content-center">
                        <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                            <BsPersonSquare/>
                        </IconContext.Provider>
                        </Col>
                        <Col xs={9}>
                            <Link to={"/profile/"+userID}><h4>{username}</h4></Link>
                            <Button onClick={this.onAcceptClick} className="search-btn">Accept</Button>
                            <Button  onClick={this.onDeclineClick} className="search-btn">Decline</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default FriendRequestCard;

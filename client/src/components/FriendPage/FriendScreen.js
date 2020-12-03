import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { Link } from 'react-router-dom';
import data from '../Mixtapez_data.json'
import UserAPI from "../../apis/UserAPI";

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
                    console.log(response.data.user);
                }
            }catch(err){

            }
            
        }
        this.setState({isLoaded: true});
    }

    componentDidMount() {
        this.getFriendsAndRequests();
    }

    render() {
        if(this.state.isLoaded){
            return (
                <div>
                    <br/>
                    <h1>Friends</h1>
                    <Link to="/friendrequests"><h4>Friend Requests (1)</h4></Link>
                    <Link to="/chat/1"><FriendCard name={data.users[1].nickName}/></Link>
                    <FriendCard name={data.users[2].nickName}/>
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

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { Link } from 'react-router-dom';
import data from '../Mixtapez_data.json'

class FriendScreen extends Component {

    render() {
        return (
            <div>
                <br/>
                <h1>Friends</h1>
                <Link to="/friendrequests"><h4>Friend Requests (1)</h4></Link>
                <Link to="/chat/1"><FriendCard name={data.users[1].nickName}/></Link>
                <FriendCard name={data.users[2].nickName}/>
            </div>
        );
    }
}

export default FriendScreen;

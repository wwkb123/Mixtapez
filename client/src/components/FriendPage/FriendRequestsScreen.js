import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendRequestCard from './FriendRequestCard.js'
import { Link } from 'react-router-dom';

class FriendRequestsScreen extends Component {

    render() {
        return (
            <div>
                <br/>
                <h1>Friend Requests (1)</h1>
                <FriendRequestCard/>
            </div>
        );
    }
}

export default FriendRequestsScreen;

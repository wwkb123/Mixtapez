import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { Link } from 'react-router-dom';

class FriendScreen extends Component {

    render() {
        return (
            <div>
                <Link to="/chat/1"><FriendCard/></Link>
                <FriendCard/>
                <FriendCard/>
            </div>
        );
    }
}

export default FriendScreen;

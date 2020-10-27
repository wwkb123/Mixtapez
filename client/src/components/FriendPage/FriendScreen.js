import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import NavigationBar from '../NavigationBar.js'
import AudioPlayerBar from '../AudioPlayerBar.js';
import FriendCard from './FriendCard.js'

class FriendScreen extends Component {

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col xs={3} className="nav-bar">
                            <NavigationBar/>
                        </Col>
                        <Col xs={9}>
                            <FriendCard/>
                            <FriendCard/>
                            <FriendCard/>
                        </Col>
                    </Row>
                </Container>
                <AudioPlayerBar/>
            </div>
        );
    }
}

export default FriendScreen;

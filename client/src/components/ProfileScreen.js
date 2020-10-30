import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import AlbumCard from './HomePage/AlbumCard.js'
import FriendCard from './FriendPage/FriendCard.js'

class ProfileScreen extends Component {

    render() {
        return (
            <div>
                <br/>
                <h1>Profile</h1>
                <FriendCard/>
                <Button className="search-btn bg-gray">Remove Friend</Button><br/><br/>
                <Container>
                    <Row>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                        <Col xs={3}>
                            <AlbumCard/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ProfileScreen;

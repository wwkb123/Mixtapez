import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import NavigationBar from './NavigationBar.js'
import AudioPlayerBar from './AudioPlayerBar.js';

class HomeScreen extends Component {

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col xs={3} className="nav-bar">
                            <NavigationBar/>
                        </Col>
                        <Col xs={9}>Main</Col>
                    </Row>
                </Container>
                <AudioPlayerBar/>
            </div>
        );
    }
}

export default HomeScreen;

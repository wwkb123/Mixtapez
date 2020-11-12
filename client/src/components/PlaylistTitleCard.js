import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import data from './Mixtapez_data.json'

class PlaylistTitleCard extends Component{
    
    render() {
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={1}>
                            Liked
                        </Col>
                        <Col xs={3}>
                            Name
                        </Col>
                        <Col xs={1}>
                            Option
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default PlaylistTitleCard;

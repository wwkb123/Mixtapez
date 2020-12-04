import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


class SongTitleCard extends Component{
    
    render() {
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={1}>
                            {/* Like */}
                        </Col>
                        <Col xs={3}>
                            Title
                        </Col>
                        <Col xs={2}>
                            Artist
                        </Col>
                        <Col xs={3}>
                            Album
                        </Col>
                        <Col xs={2}>
                            Time
                        </Col>
                        <Col xs={1}>
                            Options
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default SongTitleCard;

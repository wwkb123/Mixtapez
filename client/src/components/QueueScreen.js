import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class QueueScreen extends Component{
    render() {
        return(
            <div>
                <br/><h1>Queue</h1>
                <Button style={{"width":"10%"}} className="nav-btn">Save</Button>
                <br/>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={2}>
                            Like
                        </Col>
                        <Col xs={2}>
                            Title
                        </Col>
                        <Col xs={2}>
                            Artist
                        </Col>
                        <Col xs={2}>
                            Album
                        </Col>
                        <Col xs={2}>
                            Time
                        </Col>
                        <Col xs={2}>
                            Options
                        </Col>
                    </Row>
                    <Row className="border-bottom-accent">
                        <Col xs={2}>
                            &#9825;
                        </Col>
                        <Col xs={2}>
                            Song1
                        </Col>
                        <Col xs={2}>
                            ABC
                        </Col>
                        <Col xs={2}>
                            AAA
                        </Col>
                        <Col xs={2}>
                            01:11
                        </Col>
                        <Col xs={2}>
                            ...
                        </Col>
                    </Row>
                    <Row className="border-bottom-accent">
                        <Col xs={2}>
                            &#9825;
                        </Col>
                        <Col xs={2}>
                            Nice Song
                        </Col>
                        <Col xs={2}>
                            Him
                        </Col>
                        <Col xs={2}>
                            That album
                        </Col>
                        <Col xs={2}>
                            02:02
                        </Col>
                        <Col xs={2}>
                            ...
                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}
export default QueueScreen;

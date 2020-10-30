import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsPersonSquare } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'

class FriendRequestCard extends Component {

    render() {
        return (
            <div className="m-5">
                <Container>
                    <Row>
                        <Col xs={3} className="content-center">
                        <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                            <BsPersonSquare/>
                        </IconContext.Provider>
                        </Col>
                        <Col xs={9}>
                            <h4>wwkb123</h4>
                            <Link to="/friends"><Button className="search-btn">Accept</Button></Link>
                            <Link to="/friends"><Button className="search-btn">Decline</Button></Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default FriendRequestCard;

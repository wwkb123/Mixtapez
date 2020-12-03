import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsPersonSquare } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'

class FriendRequestCard extends Component {
    onAcceptClick = () => {

    }

    onDeclineClick = () => {

    }

    render() {
        var username = ""
        if(this.props.user){
            username = this.props.user.nickName;
        }
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
                            <h4>{username}</h4>
                            <Button onClick={this.onAcceptClick} className="search-btn">Accept</Button>
                            <Button  onClick={this.onDeclineClick} className="search-btn">Decline</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default FriendRequestCard;

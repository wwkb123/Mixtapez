import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsPersonSquare } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Link } from 'react-router-dom';

class FriendCard extends Component {

    render() {
        var username = ""
        var userID = ""
        if(this.props.user){
            username = this.props.user.nickName;
            userID = this.props.user._id;
        }
        return (
            <Link to={"/chat/"+userID}>
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
                                <h6>Now Playing: Hasodaodihdoash</h6>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Link>
        );
    }
}

export default FriendCard;

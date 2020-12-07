import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsPersonSquare } from "react-icons/bs";
import { IconContext } from "react-icons";

class FriendCard extends Component {

    render() {
        var username = ""
        var userID = ""
        if(this.props.user){
            username = this.props.user.nickName;
            userID = this.props.user._id;
        }
        var user_icon = ""
        var container_style = {}
        if(this.props.isOffline){
            user_icon = <IconContext.Provider value={{ color: "#ACACAC", size: '50px' }}>
                <BsPersonSquare/>
            </IconContext.Provider>
            container_style = {'color':'#ACACAC'}
        }else{
            user_icon = <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                <BsPersonSquare/>
            </IconContext.Provider>
        }
        
        return (
            <div className="m-3" style={container_style}>
                <Container>
                    <Row style={{'border': '3px solid', 'padding': '30px', 'borderRadius': '5px'}}>
                        <Col xs={3} className="content-center">
                            { user_icon }
                        </Col>
                        <Col xs={9}>
                            <h4>{username}</h4>
                            <h6>Now Playing: Hasodaodihdoash</h6>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default FriendCard;

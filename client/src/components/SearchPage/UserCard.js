import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


class UserCard extends Component{
    
    render() {
        var user = this.props.user;
        if(user){
            return(
                <div>
                    <Link to={"/profile/"+user._id}>
                        <Container>
                            <Row className="border-bottom-accent">
                                <Col xs={3}>
                                    {/* {data.music[id].musicName} */}
                                    { user.nickName }
                                </Col>
                                <Col xs={1}>
                                    {/* ... */}
                                </Col>
                            </Row>
                        </Container>
                    </Link>
                </div>
            );
        }else{
            return <div>error</div>
        }
    }
}
export default UserCard;

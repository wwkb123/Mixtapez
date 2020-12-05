import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


class UserTitleCard extends Component{
    
    render() {
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={4}>
                            Name
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default UserTitleCard;

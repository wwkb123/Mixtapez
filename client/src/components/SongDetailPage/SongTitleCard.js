import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { IconContext } from "react-icons";

class SongTitleCard extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    
    render() {
        
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={1}>
                            {/* Like */}
                        </Col>
                        <Col xs={3}>
                            <span>Title</span>
                        </Col>
                        <Col xs={2}>
                            <span>Artist</span>
                        </Col>
                        <Col xs={3}>
                            <span>Album</span>
                        </Col>
                        <Col xs={2}>
                            <span>Time</span>
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

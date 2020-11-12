import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import data from './Mixtapez_data.json'

class PlaylistCard extends Component{
    
    render() {
        var playlist = this.props.playlist;
        if(playlist){
            return(
                <div>
                    <Container>
                        <Row className="border-bottom-accent">
                            <Col xs={1}>
                                &#9825;
                            </Col>
                            <Col xs={3}>
                                {/* {data.music[id].musicName} */}
                                { playlist.musicListName }
                            </Col>
                            <Col xs={1}>
                                ...
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }else{
            return <div>error</div>
        }
    }
}
export default PlaylistCard;

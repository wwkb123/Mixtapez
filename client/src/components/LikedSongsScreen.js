import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import data from './Mixtapez_data.json'

class LikedSongsScreen extends Component{
    
    render() {
        var songIDs = data.users[0].favorites;
        return(
            <div>
                <br/><h1>Liked Songs</h1>
                
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
                    {songIDs.map(id => {
                        return (
                            <Row className="border-bottom-accent" key={id}>
                                <Col xs={2}>
                                    &#9825;
                                </Col>
                                <Col xs={2}>
                                    {data.music[id].musicName}
                                </Col>
                                <Col xs={2}>
                                    {data.music[id].artist}
                                </Col>
                                <Col xs={2}>
                                    {data.music[id].album}
                                </Col>
                                <Col xs={2}>
                                    0{data.music[id].length / 60}:{data.music[id].length % 60}0
                                </Col>
                                <Col xs={2}>
                                    ...
                                </Col>
                            </Row>
                        )
                    })}
                    
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
export default LikedSongsScreen;

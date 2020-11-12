import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import data from './Mixtapez_data.json'

class SongCard extends Component{
    
    render() {
        var song = this.props.song;
        if(song){
            var minutes = 0;
            minutes = Math.round((song.duration_ms/1000) / 60);
            if(minutes < 10) minutes = "0"+minutes;
            var seconds = 0;
            seconds = Math.round((song.duration_ms/1000) % 60);
            if(seconds < 10) seconds = "0"+seconds;
            return(
                <div>
                    <Container>
                        <Row className="border-bottom-accent">
                            <Col xs={1}>
                                &#9825;
                            </Col>
                            <Col xs={3}>
                                {/* {data.music[id].musicName} */}
                                { song.name }
                            </Col>
                            <Col xs={2}>
                                {/* {data.music[id].artist} */}
                                { song.artists[0].name }
                            </Col>
                            <Col xs={3}>
                                {/* {data.music[id].album} */}
                                { song.album.name }
                            </Col>
                            <Col xs={2}>
                                {/* 0{data.music[id].length / 60}:{data.music[id].length % 60}0 */}
                                { minutes }:{ seconds }
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
export default SongCard;

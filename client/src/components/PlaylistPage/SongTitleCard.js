import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class SongTitleCard extends Component{
    constructor(props){
        super(props);
    }
    onTitleClickHandler = () => {
        var handler = this.props.onTitleClickHandler;
        handler();
    }

    onArtistClickHandler = () => {
        var handler = this.props.onArtistClickHandler;
        handler();
    }

    onAlbumClickHandler = () => {
        var handler = this.props.onAlbumClickHandler;
        handler();
    }

    onTimeClickHandler = () => {
        var handler = this.props.onTimeClickHandler;
        handler();
    }
    render() {
        var titles = ""
        if(this.props.reorder_mode){
            titles = 
            <>
                <Col xs={3} style={{'cursor':'pointer'}} onClick={this.onTitleClickHandler}>
                    Title
                </Col>
                <Col xs={2} style={{'cursor':'pointer'}} onClick={this.onArtistClickHandler}>
                    Artist
                </Col>
                <Col xs={3} style={{'cursor':'pointer'}} onClick={this.onAlbumClickHandler}>
                    Album
                </Col>
                <Col xs={2} style={{'cursor':'pointer'}} onClick={this.onTimeClickHandler}>
                    Time
                </Col>
            </>
        }else{
            titles = 
            <>
                <Col xs={3}>
                    Title
                </Col>
                <Col xs={2}>
                    Artist
                </Col>
                <Col xs={3}>
                    Album
                </Col>
                <Col xs={2}>
                    Time
                </Col>
            </>
        }
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={1}>
                            Like
                        </Col>
                        {titles}
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

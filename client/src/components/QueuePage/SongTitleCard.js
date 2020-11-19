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

    placeholder = () => {

    }
    render() {
        var style_class = "";
        var onTitleClickHandler = ""
        var onArtistClickHandler = ""
        var onAlbumClickHandler = ""
        var onTimeClickHandler = ""
        if(this.props.reorder_mode){
            style_class = "reorder-mode-title"
            onTitleClickHandler = this.onTitleClickHandler
            onArtistClickHandler = this.onArtistClickHandler
            onAlbumClickHandler = this.onAlbumClickHandler
            onTimeClickHandler = this.onTimeClickHandler
        }else{
            style_class = "non-reorder-mode-title"
            onTitleClickHandler = this.placeholder
            onArtistClickHandler = this.placeholder
            onAlbumClickHandler = this.placeholder
            onTimeClickHandler = this.placeholder
        }

        
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={1}>
                            Like
                        </Col>
                        <Col xs={3} className={style_class} onClick={onTitleClickHandler}>
                            <span>Title</span>
                        </Col>
                        <Col xs={2} className={style_class} onClick={onArtistClickHandler}>
                            Artist
                        </Col>
                        <Col xs={3} className={style_class} onClick={onAlbumClickHandler}>
                            Album
                        </Col>
                        <Col xs={2} className={style_class} onClick={onTimeClickHandler}>
                            Time
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

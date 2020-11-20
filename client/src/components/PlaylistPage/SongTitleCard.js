import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { IconContext } from "react-icons";

class SongTitleCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            title_ascending: true,
            artist_ascending: true,
            album_ascending: true,
            time_ascending: true
        }
    }
    onTitleClickHandler = () => {
        var handler = this.props.onTitleClickHandler;
        handler();
        this.setState({title_ascending: !this.state.title_ascending});
        this.setState({artist_ascending: true});
        this.setState({album_ascending: true});
        this.setState({time_ascending: true});
    }

    onArtistClickHandler = () => {
        var handler = this.props.onArtistClickHandler;
        handler();
        this.setState({title_ascending: true});
        this.setState({artist_ascending: !this.state.artist_ascending});
        this.setState({album_ascending: true});
        this.setState({time_ascending: true});
    }

    onAlbumClickHandler = () => {
        var handler = this.props.onAlbumClickHandler;
        handler();
        this.setState({title_ascending: true});
        this.setState({artist_ascending: true});
        this.setState({album_ascending: !this.state.album_ascending});
        this.setState({time_ascending: true});
    }

    onTimeClickHandler = () => {
        var handler = this.props.onTimeClickHandler;
        handler();
        this.setState({title_ascending: true});
        this.setState({artist_ascending: true});
        this.setState({album_ascending: true});
        this.setState({time_ascending: !this.state.time_ascending});
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

        var title_arrow = ""
        var artist_arrow = ""
        var album_arrow = ""
        var time_arrow = ""
        
        if(this.props.reorder_mode){
            if(this.state.title_ascending){
                // up arrow
                title_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretUpFill/>
                </IconContext.Provider>
            }else{
                // down arrow
                title_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretDownFill/>
                </IconContext.Provider>
            }

            if(this.state.artist_ascending){
                // up arrow
                artist_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretUpFill/>
                </IconContext.Provider>
            }else{
                // down arrow
                artist_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretDownFill/>
                </IconContext.Provider>
            }

            if(this.state.album_ascending){
                // up arrow
                album_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretUpFill/>
                </IconContext.Provider>
            }else{
                // down arrow
                album_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretDownFill/>
                </IconContext.Provider>
            }

            if(this.state.time_ascending){
                // up arrow
                time_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretUpFill/>
                </IconContext.Provider>
            }else{
                // down arrow
                time_arrow = 
                <IconContext.Provider value={{ color: "#F06E9C", size: '15px' }}>
                    <BsFillCaretDownFill/>
                </IconContext.Provider>
            }
        }
        
       
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={1}>
                            {/* Like */}
                        </Col>
                        <Col xs={3} className={style_class} onClick={onTitleClickHandler}>
                            <span>Title</span> {title_arrow}
                        </Col>
                        <Col xs={2} className={style_class} onClick={onArtistClickHandler}>
                            <span>Artist</span> {artist_arrow}
                        </Col>
                        <Col xs={3} className={style_class} onClick={onAlbumClickHandler}>
                            <span>Album</span> {album_arrow}
                        </Col>
                        <Col xs={2} className={style_class} onClick={onTimeClickHandler}>
                            <span>Time</span> {time_arrow}
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

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

class MusicCard extends Component {
    constructor(props){
        super(props);
    }
    render() {
        var playlistID = this.props.musicListId;
        var link = "/playlist/"+playlistID;
        return (
            <Col xs={10} className="content-center">
                <Grid container spacing={0}>
                    <Grid item xs ={1}>
                        <div className='music-in-list-info'>1</div>
                    </Grid>
                    <Grid item xs ={5}>
                        <div className='music-in-list-info'>Come Together</div>
                    </Grid>
                    <Grid item xs ={2}>
                        <div className='music-in-list-info'>The Beatles</div>
                    </Grid>
                    <Grid item xs ={2}>
                        <div className='music-in-list-info'>4:18</div>
                    </Grid>
                    <Grid item xs ={1}>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                            <MdMoreHoriz/>
                        </IconContext.Provider>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs ={1}>
                        <div className='music-in-list-info'>2</div>
                    </Grid>
                    <Grid item xs ={5}>
                        <div className='music-in-list-info'>Come Together</div>
                    </Grid>
                    <Grid item xs ={2}>
                        <div className='music-in-list-info'>The Beatles</div>
                    </Grid>
                    <Grid item xs ={2}>
                        <div className='music-in-list-info'>4:18</div>
                    </Grid>
                    <Grid item xs ={1}>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                            <MdMoreHoriz/>
                        </IconContext.Provider>
                    </Grid>
                </Grid>
            </Col>
        );
    }
}

export default MusicCard;
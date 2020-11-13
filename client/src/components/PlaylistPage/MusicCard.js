import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { IconContext } from "react-icons";
import { MdMoreHoriz} from "react-icons/md";
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import Button from 'react-bootstrap/Button'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const GET_MUSIC_DETAIL = gql`
    query music($musicId: String) {
        music(id: $musicId) {
            musicName
            artist
        }
    }
`;
const options = [
    'Add to Queue',
    'Save to Liked Songs',
    'Add to Playlist',
    'Share',
    'Remove from this Playlist'
  ];

export default function MusicCard(props){

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if(index === 0){  // add to queue
            
        }else if(index === 1){ // add to liked songs

        }else if(index === 2){ // add to playlist
            // if(song){
            //     // alert("hi" + song.name);
            //     // console.log(song.name, "asdad");
            //     var modal = document.getElementById("search_modal");
            //     if(modal){
            //         var handler = props.childSongIdHandler;
            //         // console.log(handler)
            //         modal.style.display = "block";
            //         handler(song.id,song);
            //     }
                    
            // }
        }else if(index === 3){ // share

        }
    };

    const makeRangeIterator = (start = 1, end = Infinity, step = 1) => {
        let nextIndex = start;
        let iterationCount = 0;
    
        const rangeIterator = {
           next: function() {
               let result;
               if (nextIndex < end) {
                   result = { value: nextIndex, done: false }
                   nextIndex += step;
                   iterationCount++;
                   return result;
               }
               return { value: iterationCount, done: true }
           }
        };
        return rangeIterator;
    }
    
    let itr = makeRangeIterator();
    console.log(props.musics);
    let listblock = null;
    if(props.musics.length == 0){
        listblock = <div>
            <Link to='/search'>
                <Button className='nav-btn'>This list is empty, find more songs</Button>
            </Link>
        </div>
    }
    return (
        <Col xs={10} className="content-center">
            <Grid container spacing={0}>
                <Grid item xs ={1}>
                    <div className='music-list-header'>Number</div>
                </Grid>
                <Grid item xs ={5}>
                    <div className='music-list-header'>Music</div>
                </Grid>
                <Grid item xs ={2}>
                    <div className='music-list-header'>Artist</div>
                </Grid>
                <Grid item xs ={2}>
                    <div className='music-list-header'>Length</div>
                </Grid>
                <Grid item xs ={1}>
                    <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                        <MdMoreHoriz/>
                    </IconContext.Provider>
                </Grid>
            </Grid>
            {listblock}
            {
            props.musics.map((music) => 
            <Query query={GET_MUSIC_DETAIL} variables={{musicId: music._id}} key={music._id}>
                {({loading, error, data}) =>{
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    console.log(data);
                    let number = itr.next().value;
                    return(
                        <Container>
                            <Row spacing={0}>
                                <Col xs={1}>
                                    <div className='music-list-header'>{number}</div>
                                </Col>
                                <Col xs ={5}>
                                    <div className='music-list-header'>{data.music.musicName} </div>
                                </Col>
                                <Col xs ={2}>
                                    <div className='music-list-header'>{data.music.artist}</div>
                                </Col>
                                <Col xs ={2}>
                                    <div className='music-list-header'>Length</div>
                                </Col>
                                <Col xs ={1}>
                                <IconButton
                                    aria-label="more"
                                    aria-controls="menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                                        <MdMoreHoriz/>
                                    </IconContext.Provider>
                                </IconButton>
                                    <Menu
                                        id="menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            {option}
                                        </MenuItem>
                                        ))}
                                    </Menu>
                                    
                                </Col>
                            </Row>
                        </Container>
                    )
                    }}
            </Query>)}
        </Col>
    );
}

    

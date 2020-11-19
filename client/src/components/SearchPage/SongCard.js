import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {MdMoreHoriz} from "react-icons/md";
import IconButton from '@material-ui/core/IconButton';
import { IconContext } from "react-icons";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserAPI from "../../apis/UserAPI";

const options = [
    'Add to Queue',
    'Save to Liked Songs',
    'Add to Playlist',
    'Share'
  ];

export default function SongCard(props){
    var song = props.song;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleMenuItemClick = async (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if(index === 0){  // add to queue
            if(song){
                let queue = localStorage.getItem('queue');
                if(queue){
                    queue = JSON.parse(queue);
                }else{
                    queue = [];
                }
                let musicName = song.name;
                let artist = song.artists[0].name;
                let URI = song.id;
                let album = song.album.name;
                let length = Math.round(song.duration_ms/1000);
                console.log(song.id)
                try {
                    const create_response = await UserAPI.post("/createMusic", {musicName,
                        URI,
                        album,
                        length,
                        artist});
                    if (create_response.data.status == "success") {
                        console.log(create_response.data.musicId)
                        let id = create_response.data.musicId
                        const song_response = await UserAPI.get("/music/"+id);
                        if(song_response.data.status == "success"){
                            let contains = queue.map((music)=>{
                                if (music._id === song_response.data.music._id) {
                                    return true
                                }else{
                                    return false
                                }
                            }).reduce((a,b)=>{ return(a||b) });
                            console.log(contains);
                            if (!contains) {
                                queue.push(song_response.data.music);
                                localStorage.setItem('queue', JSON.stringify(queue))
                            }
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }else if(index === 1){ // add to liked songs

        }else if(index === 2){ // add to playlist
            if(song){
                // alert("hi" + song.name);
                // console.log(song.name, "asdad");
                var modal = document.getElementById("search_modal");
                if(modal){
                    var handler = props.childSongIdHandler;
                    // console.log(handler)
                    modal.style.display = "block";
                    handler(song.id,song);
                }
                    
            }
        }else if(index === 3){ // share

        }
    };

    
    if(song){
        var minutes = 0;
        minutes = Math.floor((song.duration_ms/1000) / 60);
        if(minutes < 10) minutes = "0"+minutes;
        var seconds = 0;
        seconds = Math.floor((song.duration_ms/1000) % 60);
        if(seconds < 10) seconds = "0"+seconds;
        var artist = "N/A";
        if(song.artists){
            artist = song.artists[0].name
        }
        var album = "N/A";
        if(song.album.name){
            album = song.album.name;
        }
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
                            { artist }
                        </Col>
                        <Col xs={3}>
                            {/* {data.music[id].album} */}
                            { album }
                        </Col>
                        <Col xs={2}>
                            {/* 0{data.music[id].length / 60}:{data.music[id].length % 60}0 */}
                            { minutes }:{ seconds }
                        </Col>
                        <Col xs={1}>
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
                
            </div>
        );
    }else{
        return <div>error</div>
    }
}
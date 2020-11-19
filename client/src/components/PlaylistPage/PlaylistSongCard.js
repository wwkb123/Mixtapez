import React, { Component, useEffect, useState } from 'react';
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

var options = [
    'Add to Queue',
    'Save to Liked Songs',
    'Add to Playlist',
    'Share',
    'Remove from this Playlist'
  ];


export default function PlaylistSongCard(props){
    var song = props.song;

    var modal_content = null;

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
        var mode = ""
        // normal playlist
        if(index === 0){  // add to queue
            mode = "add_queue";
        }else if(index === 1){ // add to liked songs
            mode = "add_like";
        }else if(index === 2){ // add to playlist
            mode = "add_playlist";
        }else if(index === 3){ // share
            mode = "share";
        }else if(index === 4){  // remove
            mode = "remove";
        }
        

        if(mode === "add_queue"){  // add to queue
            
        }else if(mode === "add_like"){ // add to liked songs

        }else if(mode === "add_playlist"){ // add to playlist
            if(song){
                // alert("hi" + song.name);
                // console.log(song.name, "asdad");
                var modal = document.getElementById("modal");
                if(modal){
                    // var handler = props.childSongIdHandler;
                    // console.log(handler)
                    modal.style.display = "block";
                    var updateModalContentHandler = props.updateModalContentHandler;
                    modal_content = <Button>test</Button>
                    updateModalContentHandler(modal_content);
                    // handler(song.id, song);
                    
                }
                    
            }
        }else if(mode === "share"){ // share

        }else if(mode === "remove"){  // remove
            if(song){
                // alert("hi" + song.name+ " "+song._id);
                try{
                    const response = await UserAPI.post("/removeSong", {
                        musicListId: props.musicListId,
                        songID: song._id
                    });
                    if(response.data.status === "success"){ // search success
                        // console.log("update isPublic success");
                        var updatePlaylist = props.updatePlaylist;
                        updatePlaylist();
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
    };
    
    if(song){
        var minutes = 0;
        var seconds = 0;
        if(song.length){
            minutes = Math.floor((song.length) / 60);
            if(minutes < 10) minutes = "0"+minutes;
            seconds = Math.floor((song.length) % 60);
            if(seconds < 10) seconds = "0"+seconds;
        }
        var artist = "N/A";
        if(song.artist){
            artist = song.artist
        }
        var album = "N/A";
        if(song.album){
            album = song.album
        }
        let title = "N/A"
        if(song.musicName){
            title = song.musicName
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
                            { title }
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
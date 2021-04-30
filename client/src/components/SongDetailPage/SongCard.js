import React, { Component, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MdPlayCircleOutline, MdMoreHoriz, MdDragHandle} from "react-icons/md";
import IconButton from '@material-ui/core/IconButton';
import { IconContext } from "react-icons";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserAPI from "../../apis/UserAPI";
import Button from 'react-bootstrap/Button'
import { url } from '../../config';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    RedditIcon,
    EmailIcon,
  } from "react-share";

var options = [
    'Add to Queue',
    'Add to Playlist',
    'Share'
  ];


export default function SongCard(props){
    var song = props.song;
    var modal_content = null;
    var userId = localStorage.getItem('userId');

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const onCopyClick = (e, url) =>{
        navigator.clipboard.writeText(url);
        var toast = document.getElementById("copied_toast");
        toast.className = "show"; // show the toast
        // After 3 seconds, remove the show class from toast
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
    }

    const onPlayClick = () => {
        var index = 0;
        var onSongCardClick = props.onSongCardClick;
        onSongCardClick(index);
    }

    const addSongToMusicList = async (e, songID, musicListID) => {
        console.log(songID + " " + musicListID);
        try{
            const addSong_response = await UserAPI.post("/addSong", {
                musicListID,
                songID
            });
            if(addSong_response.data.status === "success"){  // close the modal
                var modal = document.getElementById("modal");
                if(modal)
                    modal.style.display = "none";
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleMenuItemClick = async (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        var mode = ""
        // normal playlist
        if(index === 0){  // add to queue
            mode = "add_queue";
        }
        
        else if(index === 1){ // add to playlist
            mode = "add_playlist";
        }else if(index === 2){ // share
            mode = "share";
        }
        

        if(mode === "add_queue"){  // add to queue
            try {      
                let queue = localStorage.getItem('queue');
                if(queue){
                    queue = JSON.parse(queue);
                }else{
                    queue = [];
                }      
                let id = song._id
                const song_response = await UserAPI.get("/music/"+id);
                if(song_response.data.status == "success"){
                    if (queue.length > 0) {
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
                    }else{
                        queue.push(song_response.data.music);
                        localStorage.setItem('queue', JSON.stringify(queue))
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }else if(mode === "add_like"){ // add to liked songs

        }else if(mode === "add_playlist"){ // add to playlist
            if(song && userId){
                var modal = document.getElementById("modal");
                if(modal){
                    modal.style.display = "block";
                    var updateModalContentHandler = props.updateModalContentHandler;
                    try{
                        const musicLists_response = await UserAPI.get("/user/musicLists/"+userId);
                        if(musicLists_response.data.status === "success"){
                            var musicListsIDs = musicLists_response.data.musicLists;
                            var musicLists = [];
                            for(let i = 0; i < musicListsIDs.length; i++){
                                const musicList_response = await UserAPI.get("/musicList/"+musicListsIDs[i]);
                                if(musicList_response.data.status === "success"){
                                    musicLists.push(musicList_response.data.musicList);
                                }
                            }
                            modal_content = musicLists.map((musicList, index) => {
                                return(
                                    <div onClick={(e)=> addSongToMusicList(e, song._id, musicList._id)} className="playlist-card">
                                        <div>{musicList.musicListName}</div>
                                    </div>
                                )
                            })
                            updateModalContentHandler(modal_content);
                        }
                    }catch(err){
                        console.log(err);
                    }
                }
            }
        }else if(mode === "share"){ // share
            if(song){
                var modal = document.getElementById("modal");
                if(modal){
                    modal.style.display = "block";
                    var updateModalContentHandler = props.updateModalContentHandler;
                    var curr_url = url.client + "/song/" + song._id;
                    var content = 
                    <div>
                        <h3>Share this song</h3>
                        <div >
                            <div>{curr_url} <Button className="search-btn" onClick={(e) => onCopyClick(e, curr_url)}>Copy</Button></div>
                            <br/>
                            <EmailShareButton style={{'padding':'5px'}} url={curr_url}>
                                <EmailIcon size={40} round />
                            </EmailShareButton>
                            <FacebookShareButton style={{'padding':'5px'}} url={curr_url}>
                                <FacebookIcon size={40} round />
                            </FacebookShareButton>
                            <LinkedinShareButton style={{'padding':'5px'}} url={curr_url}>
                                <LinkedinIcon size={40} round />
                            </LinkedinShareButton>
                            <RedditShareButton style={{'padding':'5px'}} url={curr_url}>
                                <RedditIcon size={40} round />
                            </RedditShareButton>
                            <TwitterShareButton style={{'padding':'5px'}} url={curr_url}>
                                <TwitterIcon size={40} round />
                            </TwitterShareButton>
                        </div>
                    </div>
                    updateModalContentHandler(content);
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
        var drag_icon = ""
        if(props.reorder_mode){
            drag_icon = 
            <IconContext.Provider value={{ color: "#F06E9C", size: '25px' }}>
                <MdDragHandle/>
            </IconContext.Provider>
        }
        return(
            <div>
                <Container>
                    <Row className="border-bottom-accent">
                        <Col xs={1}>
                            { drag_icon }
                        </Col>
                        <Col xs={3}>
                            { title }
                        </Col>
                        <Col xs={2}>
                            { artist }
                        </Col>
                        <Col xs={3}>
                            { album }
                        </Col>
                        <Col xs={1}>
                            { minutes }:{ seconds }
                        </Col>
                        <Col xs={1}>
                            <IconButton
                                aria-label="play-song"
                                onClick={(e) => onPlayClick(e)}
                            >
                                <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                                    <MdPlayCircleOutline/>
                                </IconContext.Provider>
                            </IconButton>
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
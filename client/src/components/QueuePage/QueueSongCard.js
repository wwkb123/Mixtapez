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

var options = [
    // 'Save to Liked Songs',
    'Add to Playlist',
    'Share',
    'Remove from Queue'
  ];


export default function QueueSongCard(props){
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

    const onPlayClick = () => {
        var index = props.index;
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
        
        // if(index === 0){ // add to liked songs
        //     mode = "add_like";
        // }else 
        
        if(index === 0){ // add to playlist
            mode = "add_playlist";
        }else if(index === 1){ // share
            mode = "share";
        }else if(index === 2){  // remove
            mode = "remove";
        }

        if(mode === "add_like"){ // add to liked songs

        }else if(mode === "add_playlist"){ // add to playlist
            if(song && userId){
                // alert("hi" + song.name);
                // console.log(song.name, "asdad");
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

        }else if(mode === "remove"){  // remove
            if(song){
                // alert("hi" + song.name+ " "+song._id);
                let queue = JSON.parse(localStorage.getItem('queue'));
                console.log("before remove"+queue);
                let index = 0;
                for (let i = 0; i < queue.length; i++) {
                    const music = queue[i];
                    if(music._id === song._id){
                        index = i;
                        break;
                    }
                }
                console.log(index);
                if(index > -1){
                    queue.splice(index, 1);
                }
                console.log("after remove"+queue);
                localStorage.setItem('queue', JSON.stringify(queue))
                var updateMusicsHandler = props.updateMusicsHandler;
                updateMusicsHandler(queue);
                
                
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
                        <Col xs={1}>
                            {/* 0{data.music[id].length / 60}:{data.music[id].length % 60}0 */}
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
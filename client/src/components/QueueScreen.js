import React, { Component, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../tempData/AbbeyRoad.jpg'
import { MdPauseCircleOutline, MdMoreHoriz} from "react-icons/md";
import {IoMdHeartEmpty} from "react-icons/io"
import { IconContext } from "react-icons";
import Button from 'react-bootstrap/Button'
import { Grid, Paper } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserAPI from "../apis/UserAPI";
import SongCard from "./PlaylistPage/SongCard.js";
import SongTitleCard from './SongTitleCard';

import Reorder, {
    reorder,
    reorderImmutable,
    reorderFromTo,
    reorderFromToImmutable
  } from 'react-reorder';

export default function QueueScreen(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [musicList, setMusicList] = React.useState(null);
    const [musics, setMusics] = React.useState([]);
    const [owner, setOwner] = React.useState(null);
    const [reorder_mode, setReOrderMode] = React.useState(false);
    const [total_length, setTotalLength] = React.useState(0);
    var userId = localStorage.getItem('userId');
    var queue = localStorage.getItem('queue');
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
        async function fetchData() {
            setMusics(queue);
        }
        fetchData();
      }, []);
    
    function onReorder (event, previousIndex, nextIndex, fromId, toId) {
        setMusics(reorder(musics, previousIndex, nextIndex));
    }

    const onReOrderClick = () => {
        setReOrderMode(true);
    }

    const onSaveClick = async () => {
        if(reorder_mode){
            // save playlist order
            setReOrderMode(false);  // turn off reorder_mode
        }else{
            console.log("won't able to save");
        }
    }

    const onSaveQueueClick = async () => {
        // save queue as a playlist, send info to backend
    }

    let reorderButtons = null;
    let reorder_class = ""
    let save_class = ""
    if(reorder_mode){  // if mode is on
        reorder_class = "search-btn disabled";
        save_class = "search-btn"
    }else{
        reorder_class = "search-btn";
        save_class = "search-btn disabled"
    }
    if(queue !== null){
        reorderButtons =  <div>
            <Button className={reorder_class} onClick={onReOrderClick}>Re-Order</Button>
            <Button className={save_class} onClick={onSaveClick}>Save Changes</Button>
            </div>       
        var songcards = null;
        if(reorder_mode && musics && musics.length > 0){
            songcards = <Reorder
                reorderId="my-list" // Unique ID that is used internally to track this list (required)
                reorderGroup="reorder-group" // A group ID that allows items to be dragged between lists of the same group (optional)
                component="div"
                placeholderClassName="placeholder" // Class name to be applied to placeholder elements (optional), defaults to 'placeholder'
                draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
                lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
                holdTime={0} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
                onReorder={onReorder} // Callback when an item is dropped (you will need this to update your state)
                autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
                disabled={false} // Disable reordering (optional), defaults to false
                disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
            >
                {musics.map((music, index) => (
                    <div key={music._id}><SongCard musicListId={musicList._id} song={music}></SongCard></div>
                ))}
            </Reorder>
        }else if(musics && musics.length > 0){
            songcards = <div>{musics.map((music, index) => (
                <div key={music._id}><SongCard musicListId={musicList._id} song={music}></SongCard></div>
            ))}</div>
        }
        var hours = 0;
        hours = Math.round(total_length / 3600);
        if(hours < 10) hours = "0"+hours;
        var minutes = 0;
        minutes = Math.round(total_length / 60);
        if(minutes < 10) minutes = "0"+minutes;
        var seconds = 0;
        seconds = Math.round(total_length % 60);
        if(seconds < 10) seconds = "0"+seconds;
        return(
            <div>
                <Row>
                    <img src={Image} width={175} height={175} alt="">
                    </img>
                    <Col>
                        {/* <h1 style={{fontWeight: "bold"}} >{musicList.musicListName} </h1>               */}
                        <h4 style={{fontWeight: "bold"}} >{musics.length} Songs | {hours}h {minutes}m {seconds}s</h4>
                        <Button className="search-btn" onClick={onSaveQueueClick}>Save Queue</Button>
                    </Col>
                </Row>
                { reorderButtons }
                
                <SongTitleCard></SongTitleCard>
                { songcards }
                
            </div>
    
        );
    }else{
        return(
            <div>Loading...</div>
        );
    }
    

}



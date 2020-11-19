import React, { Component, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../../tempData/AbbeyRoad.jpg'
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
import UserAPI from "../../apis/UserAPI";
import QueueSongCard from "./QueueSongCard.js";
import SongTitleCard from './SongTitleCard';
import { TextField } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

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
    const [title_ascending, setTitleAscending] = React.useState(true);
    const [artist_ascending, setArtistAscending] = React.useState(true);
    const [album_ascending, setAlbumAscending] = React.useState(true);
    const [time_ascending, setTimeAscending] = React.useState(true);
    const [modal_content, setModalContent] = React.useState(null);
    const [musicListName, setMusicListName] = React.useState("");
    const [page, setPage] = React.useState(0);


    var userId = localStorage.getItem('userId');
    var queue = JSON.parse(localStorage.getItem('queue'));
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const updateMusicsHandler = (musics_new) => {
        setMusics([...musics_new]);
    }

    const updateModalContentHandler = (content) => {
        setModalContent(content);
    }

    const handleChange = (e) => {
        const {target} = e;
        setMusicListName(target.value);
    }

    const changePageHandler = (event, value)=>{
        console.log("clicked :"+value);
        
    }

    useEffect(() => {
        async function fetchData() {
            console.log(queue)
            setMusics(queue);
            var music_length = 0;
            for(let i = 0; i < queue.length; i++){
                music_length += queue[i].length;
            }
            setTotalLength(music_length);
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
            localStorage.setItem('queue', JSON.stringify(musics));
            setReOrderMode(false);  // turn off reorder_mode
        }else{
            console.log("won't able to save");
        }
    }

    const openModal = () => {
        if(localStorage.getItem('isSignedIn')){
            var modal = document.getElementById("main_modal");
            if(modal){
                modal.style.display = "block";
                var updateModalContentHandler = props.updateModalContentHandler;
                var content = <div>
                    <h2>Create New Playlist</h2>
                    <div style={{"padding":"5px"}}>
                        <TextField id="musicListName" size="small" placeholder="New List" variant="outlined" onChange={handleChange} />
                    </div>
                    {/* <Button className="search-btn" onClick={(e) => this.setMusicListNameHandler(e, addNewPlaylist)}>Create</Button> */}
                    <Button className="cancel-btn" onClick={closeModal}>Cancel</Button>
                    </div>
                updateModalContentHandler(content);
            }
        }else{
            alert("Please sign in first!");
        }
    }

    const closeModal = () =>{
        var modal = document.getElementById("main_modal");
        modal.style.display = "none";
    }

    const onSaveQueueClick = async () => {
        // save queue as a playlist, send info to backend
        
        var musics_IDs = [];
        for(let i = 0; i < musics.length; i++){
            musics_IDs.push(musics[i]._id);
        }
        console.log(musics_IDs);
        openModal();
    }

    const onTitleClickHandler = () => {
        console.log("handler triggered");
        if(musics){
            var coeff = 1;  // to toggle ascending/descending order
            if(!title_ascending){
                coeff = -1;
            }
            musics.sort((music1, music2)=>{
                if(music1.musicName < music2.musicName){
                    return -1 * coeff;
                }else if(music1.musicName > music2.musicName){
                    return 1 * coeff;
                }else{
                    return 0;
                }
            });
            setMusics([...musics]);
            setTitleAscending(!title_ascending);
            setArtistAscending(true);
            setAlbumAscending(true);
            setTimeAscending(true);
        }
    }

    const onArtistClickHandler = () => {
        console.log("handler triggered");
        if(musics){
            var coeff = 1;  // to toggle ascending/descending order
            if(!artist_ascending){
                coeff = -1;
            }
            musics.sort((music1, music2)=>{
                if(music1.artist < music2.artist){
                    return -1 * coeff;
                }else if(music1.artist > music2.artist){
                    return 1 * coeff;
                }else{
                    return 0;
                }
            });
            setMusics([...musics]);
            setTitleAscending(true);
            setArtistAscending(!artist_ascending);
            setAlbumAscending(true);
            setTimeAscending(true);
        }
    }

    const onAlbumClickHandler = () => {
        console.log("handler triggered");
        if(musics){
            var coeff = 1;  // to toggle ascending/descending order
            if(!album_ascending){
                coeff = -1;
            }
            musics.sort((music1, music2)=>{
                if(music1.album < music2.album){
                    return -1 * coeff;
                }else if(music1.album > music2.album){
                    return 1 * coeff;
                }else{
                    return 0;
                }
            });
            setMusics([...musics]);
            setTitleAscending(true);
            setArtistAscending(true);
            setAlbumAscending(!album_ascending);
            setTimeAscending(true);
        }
    }

    const onTimeClickHandler = () => {
        console.log("handler triggered");
        if(musics){
            var coeff = 1;  // to toggle ascending/descending order
            if(!time_ascending){
                coeff = -1;
            }
            musics.sort((music1, music2)=>{
                if(music1.length < music2.length){
                    return -1 * coeff;
                }else if(music1.length > music2.length){
                    return 1 * coeff;
                }else{
                    return 0;
                }
            });
            setMusics([...musics]);
            setTitleAscending(true);
            setArtistAscending(true);
            setAlbumAscending(true);
            setTimeAscending(!time_ascending);
        }
    }

    const onModalClose = () =>{
        var modal = document.getElementById("modal");
        modal.style.display = "none";
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
                    <div style={{'cursor':'move'}} key={music._id}>
                        <QueueSongCard 
                        updateModalContentHandler={updateModalContentHandler}
                        song={music} 
                        updateMusicsHandler={updateMusicsHandler}></QueueSongCard>
                        </div>
                ))}
            </Reorder>
        }else if(musics && musics.length > 0){
            console.log('musics are '+ musics);
            songcards = <div>{musics.map((music, index) => (
                <div key={music._id}>
                    <QueueSongCard
                    updateModalContentHandler={updateModalContentHandler}
                    song={music} 
                    updateMusicsHandler={updateMusicsHandler}></QueueSongCard>
                    </div>
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
                        <Button className="search-btn" onClick={onSaveQueueClick}>Save As Playlist</Button>
                    </Col>
                </Row>
                { reorderButtons }
                
                <SongTitleCard
                reorder_mode={reorder_mode}
                onTitleClickHandler={onTitleClickHandler}
                onArtistClickHandler={onArtistClickHandler}
                onAlbumClickHandler={onAlbumClickHandler}
                onTimeClickHandler={onTimeClickHandler}
                ></SongTitleCard>
                { songcards }
                <Pagination count={10} shape="rounded" size="large" onChange={changePageHandler}/>

                <div id="modal" className="modal">
                    <div className="modal-content">
                        <span onClick={onModalClose} className="close">&times;</span>
                        { modal_content }
                    </div>
                </div>
            </div>
    
        );
    }else{
        return(
            <div>Loading...</div>
        );
    }
    

}
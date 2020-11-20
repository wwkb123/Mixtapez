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
import PlaylistSongCard from "./PlaylistSongCard.js";
import SongTitleCard from './SongTitleCard';
import Pagination from '@material-ui/lab/Pagination';

import Reorder, {
    reorder,
    reorderImmutable,
    reorderFromTo,
    reorderFromToImmutable
  } from 'react-reorder';


const REMOVE_PLAYLIST = gql`
    mutation removePlaylist($userId: String!
                            $playlistId: String!
        ) {
        removePlaylist(id: $userId
                    playlistId: $playlistId){
                        _id
                    }
    }
`;

const REMOVE_MUSICLIST = gql`
    mutation removeMusicList($playlistId: String!
        ) {
            removeMusicList(id: $playlistId){
                _id
            }
    }
`;

const options = [
    'Make Private',  // should toggle with Make Public
    'Edit Details',
    'Delete',
    'Share'
  ];

export default function DisplayPlaylistScreen(props){
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
    const [page, setPage] = React.useState(0);

    var userId = localStorage.getItem('userId');
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const updateModalContentHandler = (content) => {
        setModalContent(content);
    }

    const changePageHandler = (event, value)=>{
        console.log("previous page:"+page)
        setPage(value);
        console.log("clicked :"+value);
        
    }

    const updatePlaylist = async () => {  // use setstate to trigger re-render
        try{
            const response = await UserAPI.get("/musicList/"+props.match.params.id);
            if(response.data.status === "success"){ // search success
                setMusicList(response.data.musicList);
                console.log("updatePlaylist", response.data.musicList);
                var musics = [];
                var music_length = 0;
                for(let i = 0; i < response.data.musicList.musics.length; i++){
                    let id = response.data.musicList.musics[i];
                    const song_response = await UserAPI.get("/music/"+id);
                    if(song_response.data.status == "success"){ // search success
                        musics.push(song_response.data.music);
                        music_length += song_response.data.music.length;
                    }else{
                        console.log("error searching song", id);
                    }
                }
                setMusics(Array.from(musics)); // deep copy
                setTotalLength(music_length);
                const owner_response = await UserAPI.get("/user/"+response.data.musicList.owner);  // get owner's info
                if(owner_response.data.status == "success"){ // search success
                    setOwner(owner_response.data.user);
                }
                console.log("owner", owner_response.data.user);
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleMenuItemClick = async (event, index, isPublic, isOwner) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if(index === 0){  // make public/private
            if(isOwner){
                if(isPublic){ // currently is public, once click, it'll become private, so next display text will be make public
                    options[0] = "Make Public";
                }else{
                    options[0] = "Make Private";
                }
                try{
                    const response = await UserAPI.post("/setIsPublic", {
                        id: musicList._id,
                        isPublic: !isPublic
                    });
                    if(response.data.status === "success"){ // search success
                        console.log("update isPublic success");
                        updatePlaylist();
                    }
                }catch(err){
                    console.log(err);
                }
            }else{
                alert("you do not own the playlist")
            }
        }else if(index === 1){ // Edit Details

        }else if(index === 2){ // Delete this playlist
            
        }else if(index === 3){ // share

        }
    };

    const handleOnClick = async (e, removePlaylist, removeMusicList) =>{
        e.preventDefault();
        console.log('click to remove');
        if(true){
            await removePlaylist({
                variables:{
                    userId: userId,
                    playlistId: props.match.params.id
                }
            });
            await removeMusicList({
                variables:{
                    playlistId: props.match.params.id
                }
            });
            props.history.push('/playlists');
        }
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

    useEffect(() => {
        async function fetchData() {
            try {
                setPage(1);
                const response = await UserAPI.get("/musicList/"+props.match.params.id);
                if(response.data.status == "success"){ // search success
                    // console.log("success");
                    // console.log("musiclist is", response.data.musicList);
                    setMusicList(response.data.musicList);
                    var musics = [];
                    var music_length = 0;
                    for(let i = 0; i < response.data.musicList.musics.length; i++){
                        let id = response.data.musicList.musics[i];
                        const song_response = await UserAPI.get("/music/"+id);
                        if(song_response.data.status == "success"){ // search success
                            musics.push(song_response.data.music);
                            music_length += song_response.data.music.length;
                        }else{
                            console.log("error searching song", id);
                        }
                    }
                    // console.log(musics);
                    setMusics(Array.from(musics)); // deep copy
                    setTotalLength(music_length);
                    const owner_response = await UserAPI.get("/user/"+response.data.musicList.owner);  // get owner's info
                    if(owner_response.data.status == "success"){ // search success
                        setOwner(owner_response.data.user);
                    }
                    // console.log(owner_response.data.user);
                }else{ // somehow failed
    
                }
            }catch (err) {
                console.log(err);
            }
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
            // save changes to backend
            var musicIDs = [];
            for(let i = 0; i < musics.length; i++){
                musicIDs.push(musics[i]._id);
            }
            try{
                const response = await UserAPI.post("/updateMusicList", {
                    id: musicList._id,
                    musics: musicIDs
                });
                if(response.data.status === "success"){ // search success
                    // console.log("update isPublic success");
                    // var updatePlaylist = props.updatePlaylist;
                    // updatePlaylist();
                }else{
                    console.log("error");
                }
            }catch(err){
                console.log(err);
            }
            setReOrderMode(false);  // turn off reorder_mode
        }else{
            console.log("won't able to save");
        }
    }

    const onModalClose = () =>{
        var modal = document.getElementById("modal");
        modal.style.display = "none";
    }


    let deleteButton = null;
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
    if(musicList && owner){
        if (userId === owner._id) {
            deleteButton = <Mutation mutation={REMOVE_PLAYLIST}>
                    {(removePlaylist, { loading, error }) => 
                    <Mutation mutation={REMOVE_MUSICLIST}>
                            {(removeMusicList, { loading, error }) => 
                                <BsTrashFill onClick={(e) => handleOnClick(e,removePlaylist, removeMusicList )}/> }
                    </Mutation>}
            </Mutation>
            reorderButtons =  <div>
                <Button className={reorder_class} onClick={onReOrderClick}>Re-Order</Button>
                <Button className={save_class} onClick={onSaveClick}>Save</Button>
                </div>       
        }
        var songcards = null;
        if(reorder_mode){
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
                {musics
                .map((music, index) => (
                    <div style={{'cursor':'move'}} key={music._id}>
                        <PlaylistSongCard 
                            updateModalContentHandler={updateModalContentHandler}
                            updatePlaylist={updatePlaylist} 
                            musicListId={musicList._id} 
                            song={music}>
                        </PlaylistSongCard>
                    </div>
                ))}
            </Reorder>
        }else{
            songcards = <div>{musics.slice((page-1)*10,page*10)
                .map((music, index) => (
                <div key={music._id}>
                    <PlaylistSongCard
                        updateModalContentHandler={updateModalContentHandler}
                        updatePlaylist={updatePlaylist}
                        musicListId={musicList._id} 
                        song={music}>
                    </PlaylistSongCard></div>
            ))}</div>
        }
        var playlist_type = "";
        if(!musicList.isPublic){
            playlist_type = "Private Playlist";
            options[0] = "Make Public";
        }else{
            playlist_type = "Public Playlist";
            options[0] = "Make Private";
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
                        <h1 style={{fontWeight: "bold"}} >{musicList.musicListName} </h1>              
                        <h4 style={{fontWeight: "bold"}} >{owner.nickName} | {musics.length} Songs | {hours}h {minutes}m {seconds}s</h4>
                        <h4 style={{fontWeight: "bold"}}> {playlist_type}</h4>
                    </Col>
                </Row>
                <Row xs={10}>
                    <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                        <MdPauseCircleOutline/>
                        { reorderButtons }
                        {/* <AiOutlinePlusCircle/> */}
                        {deleteButton}
                        <IconButton
                        aria-label="more"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        
                            <MdMoreHoriz/>
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
                                    onClick={(event) => handleMenuItemClick(event, index, 
                                        musicList.isPublic, (userId === owner._id)
                                    )}
                                >
                                    {option}
                                </MenuItem>)
                            )}
                        </Menu>
                    </IconContext.Provider>
                </Row>
                
                <SongTitleCard
                reorder_mode={reorder_mode}
                onTitleClickHandler={onTitleClickHandler}
                onArtistClickHandler={onArtistClickHandler}
                onAlbumClickHandler={onAlbumClickHandler}
                onTimeClickHandler={onTimeClickHandler}
                ></SongTitleCard>
                { songcards }
                <Pagination count={parseInt(musics.length/10+(musics.length%10 > 0?1:0))} shape="rounded" size="large" onChange={changePageHandler}/>

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



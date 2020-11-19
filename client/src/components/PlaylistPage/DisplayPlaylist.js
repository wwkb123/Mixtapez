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
import SongCard from "./SongCard.js";
import SongTitleCard from './SongTitleCard';

import Reorder, {
    reorder,
    reorderImmutable,
    reorderFromTo,
    reorderFromToImmutable
  } from 'react-reorder';



const GET_LIST_DETAIL = gql`
    query musicList($musicListId: String) {
        musicList(id: $musicListId) {
            musicListName
            musics{
                _id
            }
            owner{
                _id
            }
            isPublic
        }
    }
`;

const GET_PLAYLIST = gql`
    query user($userId: String) {
        user(id: $userId) {
            nickName
        }
    }
`;

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

const UPDATE_MUSICLIST = gql`
    mutation updateMusicList(
        $playlistId: String!
        $musicListName: String!
        $isPublic: Boolean!
        ) {
            updateMusicList(
                id: $playlistId
                musicListName: $musicListName
                isPublic: $isPublic
            ){
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

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const updatePlaylist = async () => {  // use setstate to trigger re-render
        try{
            const response = await UserAPI.get("/musicList/"+props.match.params.id);
            if(response.data.status === "success"){ // search success
                setMusicList(response.data.musicList);
                console.log("updatePlaylist", response.data.musicList);
                var musics = [];
                for(let i = 0; i < response.data.musicList.musics.length; i++){
                    let id = response.data.musicList.musics[i];
                    const song_response = await UserAPI.get("/music/"+id);
                    if(song_response.data.status == "success"){ // search success
                        musics.push(song_response.data.music);
                    }else{
                        console.log("error searching song", id);
                    }
                }
                setMusics(Array.from(musics)); // deep copy
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
        if(index === 0){  // add to queue
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

    const handleOnClick = async (e, removePlaylist, removeMusicList) =>{
        e.preventDefault();
        console.log('click to remove');
        if(true){
            console.log(props.userId);
            console.log(props.match.params.id);
            await removePlaylist({
                variables:{
                    userId: props.userId,
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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await UserAPI.get("/musicList/"+props.match.params.id);
                if(response.data.status == "success"){ // search success
                    console.log("success");
                    console.log("musiclist is", response.data.musicList);
                    setMusicList(response.data.musicList);
                    var musics = [];
                    for(let i = 0; i < response.data.musicList.musics.length; i++){
                        let id = response.data.musicList.musics[i];
                        const song_response = await UserAPI.get("/music/"+id);
                        if(song_response.data.status == "success"){ // search success
                            musics.push(song_response.data.music);
                        }else{
                            console.log("error searching song", id);
                        }
                    }
                    console.log(musics);
                    setMusics(Array.from(musics)); // deep copy
                    const owner_response = await UserAPI.get("/user/"+response.data.musicList.owner);  // get owner's info
                    if(owner_response.data.status == "success"){ // search success
                        setOwner(owner_response.data.user);
                    }
                    console.log(owner_response.data.user);
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

    const onSaveClick = () => {
        if(reorder_mode){
            // save changes to backend

            setReOrderMode(false);  // turn off reorder_mode
        }
    }
    console.log(props.match.params.id);
    let deleteButton = null;
    let reorderButtons = null;
    if(musicList && owner){
        if (props.userId === owner._id) {
            deleteButton = <Mutation mutation={REMOVE_PLAYLIST}>
                    {(removePlaylist, { loading, error }) => 
                    <Mutation mutation={REMOVE_MUSICLIST}>
                            {(removeMusicList, { loading, error }) => 
                                <BsTrashFill onClick={(e) => handleOnClick(e,removePlaylist, removeMusicList )}/> }
                    </Mutation>}
            </Mutation>
            reorderButtons =  <div>
                <Button className="search-btn" onClick={onReOrderClick}>Re-Order</Button>
                <Button className="search-btn" onClick={onSaveClick}>Save</Button>
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
                {musics.map((music, index) => (
                    <div key={music._id}><SongCard updatePlaylist={updatePlaylist} musicListId={musicList._id} song={music}></SongCard></div>
                ))}
            </Reorder>
        }else{
            songcards = <div>{musics.map((music, index) => (
                <div key={music._id}><SongCard updatePlaylist={updatePlaylist} musicListId={musicList._id} song={music}></SongCard></div>
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
        console.log("changed playlist type", musicList);
        return(
            <div>
                <Row>
                    <img src={Image} width={175} height={175} alt="">
                    </img>
                    <Col>
                        <h1 style={{fontWeight: "bold"}} >{musicList.musicListName} </h1>              
                        <h4 style={{fontWeight: "bold"}} >{owner.nickName} | {musics.length} Songs | 0 second</h4>
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
                                        musicList.isPublic, (props.userId === owner._id)
                                    )}
                                >
                                    {option}
                                </MenuItem>)
                            )}
                        </Menu>
                    </IconContext.Provider>
                </Row>
                
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



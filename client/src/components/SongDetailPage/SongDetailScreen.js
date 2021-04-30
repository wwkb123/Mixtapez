import React, { Component, useEffect } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../../tempData/AbbeyRoad.jpg'
import default_image from '../../tempData/default_image.png'
import { MdPlayCircleOutline, MdMoreHoriz} from "react-icons/md";
import { IconContext } from "react-icons";
import Button from 'react-bootstrap/Button'
import IconButton from '@material-ui/core/IconButton';
import UserAPI from "../../apis/UserAPI";
import SongCard from "./SongCard.js";
import SongTitleCard from './SongTitleCard';
import { TextField } from '@material-ui/core';

export default function SongDetailScreen(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [music, setMusic] = React.useState(null);
    const [total_length, setTotalLength] = React.useState(0);

    const [modal_content, setModalContent] = React.useState(null);
    const [musicListName, setMusicListName] = React.useState("");
    const [loadingFinished, setLoadingFinished] = React.useState(false);

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

    const handleChange = (e) => {
        const {target} = e;
        setMusicListName(target.value);
    }

    const updateNavBar = () => {
        var navbtns = document.getElementsByClassName("nav-btn");
        if(navbtns){
            for(let i = 0; i < navbtns.length; i++){
                if(navbtns[i]){
                    if(navbtns[i].id === "songdetail"){
                        navbtns[i].classList.add("curr-page");
                    }else{
                        navbtns[i].classList.remove("curr-page");
                    }
                }
            }
        }
    }
    
    useEffect(() => {
        async function fetchData() {
            var songID = props.match.params.id;
            const song_response = await UserAPI.get("/musicListRoute/music/"+songID);
            if(song_response.data.status === "success"){ // search success
                setMusic(song_response.data.music);
                setTotalLength(song_response.data.music.length);
            }else{
                console.log("error searching song");
            }
            setLoadingFinished(true);
        }
        fetchData();
        updateNavBar();
    }, []);

    const saveAsMusicListHandler = async (e, musicsIDs) => {
        var name = document.getElementById('musicListName').value;  // get value of input field
        if(name === "") return;
        try{
            const response = await UserAPI.post('/musicListRoute/createMusicListWithMusics', {
                musicListName: name,
                musics: musicsIDs,
                userId
            });
            if(response.data.status === "success"){  // add musicListId to user's musicLists
                var musicListId = response.data.musicListId;
                const addMusicListId_response = await UserAPI.post('/musicListRoute/addMusicList', {
                    musicListId,
                    userId
                });
                if(addMusicListId_response.data.status === "success"){
                    closeModal();
                }
            }
        }catch(err){
            console.log(err);
        }
        
    }

    const openModal = (musicsIDs) => {
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
                    <Button className="search-btn" onClick={(e) => saveAsMusicListHandler(e, musicsIDs)}>Create</Button>
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
        // save the song as a playlist, send info to backend
        
        if(music){
            openModal([music._id]);
        }
        
    }

    const onModalClose = () =>{
        var modal = document.getElementById("modal");
        if(modal)
            modal.style.display = "none";
    }

    const onSongCardClick = (index) => {
        if(music){
            var loadQueueIndexToAudioPlayer = props.loadQueueIndexToAudioPlayer;
            var queue = localStorage.getItem('queue');
            if(queue){
                queue = JSON.parse(queue);
            }else{
                queue = [];
            }

            let found = false;
            let index = queue.length-1;
            for(let i = 0; i < queue.length; i++){
                if(queue[i])
                    if(queue[i]._id === music._id){
                        found = true;
                        index = i;
                    }
            }
            if(!found){ // if the song is not in the queue
                queue.push(music);
                index = queue.length-1;
            }else{  // same song already exists, play from that index

            }
            localStorage.setItem('queue', JSON.stringify(queue));
            loadQueueIndexToAudioPlayer(index);
        }
    }

    if(music !== null){      
        var songcards = null;
        songcards = <SongCard
            updateModalContentHandler={updateModalContentHandler}
            song={music}
            onSongCardClick={onSongCardClick}
        ></SongCard>
        var hours = 0;
        hours = Math.floor(total_length / 3600);
        if(hours < 10) hours = "0"+hours;
        var minutes = 0;
        minutes = Math.floor(total_length / 60);
        if(minutes < 10) minutes = "0"+minutes;
        var seconds = 0;
        seconds = Math.floor(total_length % 60);
        if(seconds < 10) seconds = "0"+seconds;

        return(
            <div>
                <Row>
                    <img className="playlist-image" src={default_image} width={175} height={175} alt="">
                    </img>
                    <Col>
                        <h1 style={{fontWeight: "bold"}} > {music.musicName} </h1>              
                        <h4 style={{fontWeight: "bold"}} >{hours}h {minutes}m {seconds}s</h4>
                        <Button className="search-btn" onClick={onSaveQueueClick}>Save As Playlist</Button>
                    </Col>
                </Row>
                
                <SongTitleCard
                ></SongTitleCard>
                { songcards }

                <div id="modal" className="modal">
                    <div className="modal-content">
                        <span onClick={onModalClose} className="close">&times;</span>
                        { modal_content }
                    </div>
                </div>
            </div>
    
        );
    }else{
        if(!loadingFinished){
            return(
                <div>Loading...</div>
            );
        }else{
            return(
                <div>Can't find this song.</div>
            );
        }
       
    }
    

}

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {MdMoreHoriz, MdPlayCircleOutline} from "react-icons/md";
import IconButton from '@material-ui/core/IconButton';
import { IconContext } from "react-icons";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserAPI from "../../apis/UserAPI";

const options = [
    'Add to Queue',
    // 'Save to Liked Songs',
    'Add to Playlist',
    'Share'
  ];

export default function SongCard(props){
    var song = props.song;
    var userId = localStorage.getItem('userId');
    var modal_content = null;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const onPlayClick = async () => {
        if(!localStorage.getItem('isSignedIn')){
            alert("Please sign in to use this function.");
            return;
        }
        let musicName = song.name;
        let artist = song.artists[0].name;
        let URI = song.id;
        let album = song.album.name;
        let length = Math.round(song.duration_ms/1000);
        try{
            const create_response = await UserAPI.post("/createMusic", {musicName,
                URI,
                album,
                length,
                artist});
            if (create_response.data.status === "success") {
                var loadQueueIndexToAudioPlayer = props.loadQueueIndexToAudioPlayer;
                var queue = localStorage.getItem('queue');
                if(queue){
                    queue = JSON.parse(queue);
                }else{
                    queue = [];
                }
                const song_response = await UserAPI.get("/music/"+create_response.data.musicId);
                if(song_response.data.status === "success"){
                    let found = false;
                    let index = queue.length-1;
                    for(let i = 0; i < queue.length; i++){
                        if(queue[i])
                            if(queue[i]._id === song_response.data.music._id){
                                found = true;
                                index = i;
                            }
                    }
                    if(!found){ // if the song is not in the queue
                        queue.push(song_response.data.music);
                        index = queue.length-1;
                    }else{  // same song already exists, play from that index

                    }
                    
                    localStorage.setItem('queue', JSON.stringify(queue));
                    loadQueueIndexToAudioPlayer(index);
                }
                
            }
        }catch(err){

        }
    }

    const addSongToMusicList = async (e, song, musicListID) => {
        let musicName = song.name;
        let artist = song.artists[0].name;
        let URI = song.id;
        let album = song.album.name;
        let length = Math.round(song.duration_ms/1000);
        
        try{
            const create_response = await UserAPI.post("/createMusic", {musicName,
                URI,
                album,
                length,
                artist});
            if (create_response.data.status === "success") {
                let songID = create_response.data.musicId
                const addSong_response = await UserAPI.post("/addSong", {
                    musicListID,
                    songID
                });
                if(addSong_response.data.status === "success"){  // close the modal
                    var modal = document.getElementById("modal");
                    if(modal)
                        modal.style.display = "none";
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleMenuItemClick = async (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if(!localStorage.getItem('isSignedIn')){
            alert("Please sign in to use this function.");
            return;
        }
        if(index === 0){  // add to queue
            if(song && userId){
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
                try {
                    const create_response = await UserAPI.post("/createMusic", {musicName,
                        URI,
                        album,
                        length,
                        artist});
                    if (create_response.data.status === "success") {
                        console.log(create_response.data.musicId)
                        let id = create_response.data.musicId
                        const song_response = await UserAPI.get("/music/"+id);
                        console.log(id);
                        if(song_response.data.status === "success"){
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
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        // else if(index === 1){ // add to liked songs

        // }
        else if(index === 1){ // add to playlist
            if(song && userId){
                // alert("hi" + song.name);
                // console.log(song.name, "asdad");
                var modal = document.getElementById("modal");
                if(modal){
                    var handler = props.childSongIdHandler;
                    // console.log(handler)
                    modal.style.display = "block";
                    handler(song.id,song);

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
                                    <div key={index} onClick={(e)=> addSongToMusicList(e, song, musicList._id)} className="playlist-card">
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
        }else if(index === 2){ // share

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
                            {/* &#9825; */}
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
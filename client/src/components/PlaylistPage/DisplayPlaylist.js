import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../../tempData/AbbeyRoad.jpg'
import default_image from '../../tempData/default_image.png'
import { MdPlayCircleOutline, MdMoreHoriz} from "react-icons/md";
import { IconContext } from "react-icons";
import Button from 'react-bootstrap/Button'
import { BsTrashFill } from "react-icons/bs";
import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserAPI from "../../apis/UserAPI";
import PlaylistSongCard from "./PlaylistSongCard.js";
import SongTitleCard from './SongTitleCard';
import Pagination from '@material-ui/lab/Pagination';
import { Link } from 'react-router-dom';
import { TextField } from '@material-ui/core';

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

var options = [
    'Make Private',  // should toggle with Make Public
    'Change Cover Image',
    // 'Delete',
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
    const [forkFromID, setForkFromID] = React.useState(null);
    const [forkFromName, setForkFromName] = React.useState(null);
    const [forkOwnerName, setForkOwnerName] = React.useState(null);
    const [newImageText, setNewImageText] = React.useState("");
    const [coverImageURL, setCoverImageURL] = React.useState("");

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

    const onSongCardClick = (index) => {
        var queue = [];
        queue = Array.from(musics);
        localStorage.setItem('queue', JSON.stringify(queue));
        var loadQueueSongsToAudioPlayerCallBack = props.loadQueueSongsToAudioPlayer;
        if(queue && index < queue.length )
            loadQueueSongsToAudioPlayerCallBack(queue[index]);
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
                    if(song_response.data.status === "success"){ // search success
                        musics.push(song_response.data.music);
                        music_length += song_response.data.music.length;
                    }else{
                        console.log("error searching song", id);
                    }
                }
                setMusics(Array.from(musics)); // deep copy
                setTotalLength(music_length);
                const owner_response = await UserAPI.get("/user/"+response.data.musicList.owner);  // get owner's info
                if(owner_response.data.status === "success"){ // search success
                    setOwner(owner_response.data.user);
                }
                console.log("owner", owner_response.data.user);
            }
        }catch(err){
            console.log(err);
        }
    }

    const onCopyClick = (e, url) =>{
        navigator.clipboard.writeText(url);
        var toast = document.getElementById("copied_toast");
        toast.className = "show"; // show the toast
        // After 3 seconds, remove the show class from toast
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
    }

    const handleMenuItemClick = async (event, index, isPublic, isOwner) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        var mode = options[index]; // Make Public/Make Private/Edit Details/Share/Fork

        if(mode === "Make Public" || mode === "Make Private"){  // make public/private
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
        }else if(mode === "Edit Details"){ // Edit Details

        // }else if(index === 2){ // Delete this playlist
            
        }else if(mode === "Share"){ // share
            var modal = document.getElementById("modal");
            if(modal){
                modal.style.display = "block";
                var curr_url = window.location.href;
                var content = 
                    <div>
                        <h3>Share this playlist</h3>
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
            
        }else if(mode === "Fork"){ // Fork
            // console.log("will fork");
            // console.log("userId:"+props.userId);
            // console.log("musicList:"+musicList._id);
            try {
                const response = await UserAPI.post('/forkMusicList',{
                    userId: props.userId,
                    musicListId: musicList._id
                });
                if (response.data.status === "success") {
                    // console.log("fork successful");
                    // console.log(response.data.musicList)
                    props.history.push("/playlist/"+response.data.musicList._id);
                }
            } catch (err) {
                console.log(err);
            }
        }else if(mode === "Change Cover Image"){
            var modal = document.getElementById("modal");
            if(modal){
                modal.style.display = "block";
                var content = 
                    <div>
                        <h3>Update Image URL</h3>
                        <div>Leave it empty for default image.</div>
                        <div >
                            <TextField id="newImageText" size="small" placeholder="new image URL" variant="outlined" onChange={handleTextChange}/>
                        </div>
                        <br/>
                        <Button className="search-btn" onClick={(e) => sendNewImageURL(e, musicList._id)}>Submit</Button>
                        <Button className="cancel-btn" onClick={closeModal}>Cancel</Button>
                    </div>
                updateModalContentHandler(content);
            }
        }
    };

    const openChangeImageURLModal = () => {
        var modal = document.getElementById("modal");
        if(modal){
            modal.style.display = "block";
            var content = 
                <div>
                    <h3>Update Image URL</h3>
                    <div>Leave it empty for default image.</div>
                    <div >
                        <TextField id="newImageText" size="small" placeholder="new image URL" variant="outlined" onChange={handleTextChange}/>
                    </div>
                    <br/>
                    <Button className="search-btn" onClick={(e) => sendNewImageURL(e, musicList._id)}>Submit</Button>
                    <Button className="cancel-btn" onClick={closeModal}>Cancel</Button>
                </div>
            updateModalContentHandler(content);
        }
    }

    const handleTextChange = (e) => {
        const {target} = e;
        setNewImageText(target.value);
    }

    const sendNewImageURL = async (e, musicListId) => {
        var textfield = document.getElementById('newImageText');
        if(textfield){
            var URL = textfield.value;
            try{
                const response = await UserAPI.post('/updatePlaylistImage', {
                    id: musicListId,
                    imageURL: URL
                });
                if(response.data.status === "success"){ // search success
                    setMusicList(response.data.musicList);
                }
            }catch(err){
                console.log(err);
            }
        }
        closeModal();
        window.location.reload();
    }

    const closeModal = () =>{
        var modal = document.getElementById("modal");
        if(modal){
            modal.style.display = "none";
        }
    }

    const onPlayClick = () =>{
        var queue = [];
        queue = Array.from(musics);
        if(queue && queue.length > 0)
            localStorage.setItem('queue', JSON.stringify(queue));
        var loadQueueSongsToAudioPlayerCallBack = props.loadQueueSongsToAudioPlayer;
        if(queue && queue.length > 0)
            loadQueueSongsToAudioPlayerCallBack(queue[0]);
    }

    const onDeleteClick = (e, removePlaylist, removeMusicList) => {
        if(localStorage.getItem('isSignedIn')){
            var modal = document.getElementById("main_modal");
            if(modal){
                modal.style.display = "block";
                var updateMainModalContentHandler = props.updateMainModalContentHandler;
                var content = <div>
                    <h3>Are you sure to delete the playlist "{musicList.musicListName}"?</h3>
                    <Button className="search-btn" onClick={(e) => onDeleteConfirm(e, removePlaylist, removeMusicList)}>Confirm</Button>
                    <Button className="cancel-btn" onClick={closeMainModal}>Cancel</Button>
                    </div>
                updateMainModalContentHandler(content);
            }
        }else{
            alert("Please sign in first!");
        }
    }
    const onDeleteConfirm = async (e, removePlaylist, removeMusicList) =>{
        e.preventDefault();
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
        closeMainModal();
        props.history.push('/playlists');
    
    }

    const closeMainModal = () =>{
        var modal = document.getElementById("main_modal");
        modal.style.display = "none";
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

    const updateNavBar = () => {
        var navbtns = document.getElementsByClassName("nav-btn");
        if(navbtns){
            for(let i = 0; i < navbtns.length; i++){
                if(navbtns[i]){
                    if(navbtns[i].id === "playlists"){
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
            try {
                setPage(1);
                const response = await UserAPI.get("/musicList/"+props.match.params.id);
                if(response.data.status === "success"){ // search success
                    // console.log("success");
                    // console.log("musiclist is", response.data.musicList);
                    setMusicList(response.data.musicList);
                    if(response.data.musicList.image){
                        setCoverImageURL(response.data.musicList.image);
                    }
                    
                    var musics = [];
                    var music_length = 0;
                    for(let i = 0; i < response.data.musicList.musics.length; i++){
                        let id = response.data.musicList.musics[i];
                        const song_response = await UserAPI.get("/music/"+id);
                        if(song_response.data.status === "success"){ // search success
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
                    if(owner_response.data.status === "success"){ // search success
                        setOwner(owner_response.data.user);
                    }

                    // get fork info
                    var fork_from = ""
                    var fork_owner = ""
                    if(response.data.musicList.forkFrom && response.data.musicList.forkOwner){
                        fork_from = response.data.musicList.forkFrom;
                        fork_owner = response.data.musicList.forkOwner;
                        const fork_from_response = await UserAPI.get("/musicList/"+fork_from);
                        if(fork_from_response.data.status === "success"){ // search success
                            setForkFromID(fork_from);
                            setForkFromName(fork_from_response.data.musicList.musicListName);
                        }

                        const fork_owner_response = await UserAPI.post("/user/nickName", {
                            id: fork_owner
                        });

                        if(fork_owner_response.data.status === "success"){ // search success
                            setForkOwnerName(fork_owner_response.data.nickName);
                        }
                    }else{
                        setForkFromID(null);
                        setForkFromName(null);
                        setForkOwnerName(null);
                    }
                    
                    // console.log(owner_response.data.user);
                }else{ // somehow failed
    
                }
            }catch (err) {
                console.log(err);
            }
        }
        fetchData();
        updateNavBar();
      }, []);

      useEffect(() => {
        if(owner){
            if(userId === owner._id){
                options = [
                    'Make Private',  // should toggle with Make Public
                    // 'Edit Details',
                    'Change Cover Image',
                    // 'Delete',
                    'Share'
                  ];
            }else{
                options = [
                    'Fork',
                    'Share'
                ];
                
            }
        }
      }, [owner])

      // re render when new props received
      useEffect(() => {
        async function fetchData() {
            try {
                setPage(1);
                const response = await UserAPI.get("/musicList/"+props.match.params.id);
                if(response.data.status === "success"){ // search success
                    // console.log("success");
                    // console.log("musiclist is", response.data.musicList);
                    setMusicList(response.data.musicList);
                    if(response.data.musicList.image){
                        setCoverImageURL(response.data.musicList.image);
                    }
                    var musics = [];
                    var music_length = 0;
                    for(let i = 0; i < response.data.musicList.musics.length; i++){
                        let id = response.data.musicList.musics[i];
                        const song_response = await UserAPI.get("/music/"+id);
                        if(song_response.data.status === "success"){ // search success
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
                    if(owner_response.data.status === "success"){ // search success
                        setOwner(owner_response.data.user);
                    }

                    // get fork info
                    var fork_from = ""
                    var fork_owner = ""
                    if(response.data.musicList.forkFrom && response.data.musicList.forkOwner){
                        fork_from = response.data.musicList.forkFrom;
                        fork_owner = response.data.musicList.forkOwner;
                        const fork_from_response = await UserAPI.get("/musicList/"+fork_from);
                        if(fork_from_response.data.status === "success"){ // search success
                            setForkFromID(fork_from);
                            setForkFromName(fork_from_response.data.musicList.musicListName);
                        }

                        const fork_owner_response = await UserAPI.post("/user/nickName", {
                            id: fork_owner
                        });

                        if(fork_owner_response.data.status === "success"){ // search success
                            setForkOwnerName(fork_owner_response.data.nickName);
                        }
                    }else{
                        setForkFromID(null);
                        setForkFromName(null);
                        setForkOwnerName(null);
                    }
                    // console.log(owner_response.data.user);
                }else{ // somehow failed
    
                }
            }catch (err) {
                console.log(err);
            }
        }
        fetchData();
      }, [props.match.params.id]);
    
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
                                <BsTrashFill style={{'cursor':'pointer'}} onClick={(e) => onDeleteClick(e,removePlaylist, removeMusicList )}/> }
                    </Mutation>}
            </Mutation>
            reorderButtons =  <div>
                <Button className={reorder_class} onClick={onReOrderClick}>Reorder Songs</Button>
                <Button className={save_class} onClick={onSaveClick}>Save Changes</Button>
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
                            reorder_mode={reorder_mode}
                            updateModalContentHandler={updateModalContentHandler}
                            updatePlaylist={updatePlaylist} 
                            musicListId={musicList._id} 
                            song={music}>
                        </PlaylistSongCard>
                    </div>
                ))}
            </Reorder>
        }else{
            if(musics.length > 0){
                songcards = <div>{musics.slice((page-1)*10,page*10)
                    .map((music, index) => (
                    <div key={music._id}>
                        <PlaylistSongCard
                            reorder_mode={reorder_mode}
                            updateModalContentHandler={updateModalContentHandler}
                            updatePlaylist={updatePlaylist}
                            musicListId={musicList._id}
                            index={index}
                            onSongCardClick={onSongCardClick}
                            song={music}>
                        </PlaylistSongCard></div>
                ))}</div>
            }else{
                songcards =
                <div>
                    <center>
                    <h2>This playlist is empty.</h2>
                    <Link to="/search"><Button style={{'color':'white'}} className="search-btn">Go find some songs</Button></Link>
                    </center>
                </div>
            }
           
        }
        var playlist_type = "";
        if(userId === owner._id){
            if(!musicList.isPublic){
                playlist_type = "Private Playlist";
                options[0] = "Make Public";
            }else{
                playlist_type = "Public Playlist";
                options[0] = "Make Private";
            }
        }else{
            if(!musicList.isPublic){ // not the owner of private playlist
                return(
                    <div>
                        You are not the owner of this private playlist.
                    </div>
                )
            }
        }
        
        var hours = 0;
        hours = Math.floor(total_length / 3600);
        if(hours < 10) hours = "0"+hours;
        var minutes = 0;
        minutes = Math.floor(total_length / 60);
        if(minutes < 10) minutes = "0"+minutes;
        var seconds = 0;
        seconds = Math.floor(total_length % 60);
        if(seconds < 10) seconds = "0"+seconds;
        var fork_info = ""
        if(forkFromName && forkFromID && forkOwnerName){
            fork_info = <div>
            <span>forked from </span><Link to={"/playlist/"+forkFromID}><span style={{'fontSize':'20px'}}>{forkOwnerName}/{forkFromName}</span></Link>
            </div>
        }
        var image_src = default_image
        if(coverImageURL){
            if(coverImageURL !== ""){
                image_src = coverImageURL
            }
        }
        var cover_card = ""
        if(userId === owner._id){
            cover_card = 
            <div style={{'cursor':'pointer'}} onClick={openChangeImageURLModal}>
                <img className="playlist-image" src={image_src} width={175} height={175} alt="">
                </img>
            </div>
        }else{
            cover_card = 
            <div>
                <img className="playlist-image" src={image_src} width={175} height={175} alt="">
                </img>
            </div>
        }
        return(
            <div>
                <Row>
                    { cover_card }
                    <Col>
                        <h1 style={{fontWeight: "bold"}} >{musicList.musicListName} </h1>              
                        <span>by </span><Link to={"/profile/"+owner._id}><span style={{'fontSize':'28px'}}>{owner.nickName}</span></Link><br/>
                        { fork_info }
                        <br/>
                        <h4 style={{fontWeight: "bold"}} >{musics.length} Songs | {hours}h {minutes}m {seconds}s</h4>
                        <h4 style={{fontWeight: "bold"}}> {playlist_type}</h4>
                        
                    </Col>
                </Row>
                <Row xs={10}>
                    <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                        <IconButton
                            aria-label="play"
                            onClick={onPlayClick}
                        >
                            <MdPlayCircleOutline/>
                        </IconButton>
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



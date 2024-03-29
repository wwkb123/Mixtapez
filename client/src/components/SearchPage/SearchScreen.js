import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { TextField } from '@material-ui/core';
import { NativeSelect } from '@material-ui/core';
import UserAPI from "../../apis/UserAPI";
import SongCard from "./SongCard.js";
import SongTitleCard from "./SongTitleCard.js";
import UserCard from "./UserCard.js";
import PlaylistCard from "./PlaylistCard.js";
import UserTitleCard from "./UserTitleCard.js";
import PlaylistTitleCard from "./PlaylistTitleCard.js";
import '../modal.css';
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'
import Pagination from '@material-ui/lab/Pagination';

const GET_PLAYLIST = gql`
    query user($userId: String) {
        user(id: $userId) {
            musicLists{
                _id
            }
        }
    }
`;

const GET_LIST_DETAIL = gql`
    query musicList($musicListId: String) {
        musicList(id: $musicListId) {
            musicListName
            owner{
                _id
            }
            musics{
                _id
            }
        }
    }
`;

const ADD_MUSIC_TO_MUSICLIST = gql`
    mutation addMusicToMusicList(
        $musicListId: String!
        $musicId: String!
    ) {
        addMusicToMusicList(
        id: $musicListId
        musicId: $musicId
    ){
    _id
    }
    }
`;

class SearchScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            select: "song",
            search_text: "",
            search_results: [],
            search_results_mode: "song",
            songID: "",
            songInfo: {},
            page: 1,
            musics:[],
            initialized: false,
            modal_content: null
        }
        this.childSongIdHandler = this.childSongIdHandler.bind(this);
        this.updateModalContentHandler = this.updateModalContentHandler.bind(this);
    }

    componentDidMount() {
        this.updateNavBar();
    }

    updateNavBar = () => {
        var navbtns = document.getElementsByClassName("nav-btn");
        if(navbtns){
            for(let i = 0; i < navbtns.length; i++){
                if(navbtns[i]){
                    if(navbtns[i].id === "search"){
                        navbtns[i].classList.add("curr-page");
                    }else{
                        navbtns[i].classList.remove("curr-page");
                    }
                }
            }
        }
    }

    handleChange = (e) => {
        const {target} = e;
    
        this.setState( (state) => ({
            ...state,
            [target.id]: target.value
    
        }));
    }

    changePageHandler = (event, value)=>{
        this.setState({page: value});
        
    }

    onClick = async (e) => {
        e.preventDefault();
        var search_for = this.state.select;  // song/artist/album/user/playlist
        var search_text = this.state.search_text;
        if(search_text !== ""){  // not empty
            try {
                const response = await UserAPI.post("/search/"+search_for, {
                    search_text
                });
                if(response.data.status === "success"){ // search success
                    this.setState({search_results_mode: search_for});
                    this.setState({search_results: response.data.results});
                    
                }else{ // somehow failed
                    
                }
            }catch (err) {
                console.log(err);
            }
        }
    }

    onClose = () =>{
        var modal = document.getElementById("modal");
        if(modal)
            modal.style.display = "none";
    }

    // deprecated
    onAddPlaylistClick = async (e, musicListId, addMusicToMusicList) => {
        e.preventDefault();
        var songID = this.state.songID;
        if(songID !== ""){
        }
        try {
            let musicName = this.state.songInfo.name;
            let artist = this.state.songInfo.artists[0].name;
            let URI = this.state.songID;
            let album = this.state.songInfo.album.name;
            let length = Math.round(this.state.songInfo.duration_ms/1000);
            
            const create_response = await UserAPI.post("/createMusic", {musicName,
                                                                    URI,
                                                                    album,
                                                                    length,
                                                                    artist});
            if (create_response.data.status === "success") {
               const request_musicList = await UserAPI.get("/musicListRoute/musicList/"+musicListId);
               if (request_musicList.data.status == "success") {
                 let musicList = request_musicList.data.musicList.musics;

                 if (musicList.length > 0) {
                    let control = true;
                    musicList.forEach(mus => {
                        if(mus === create_response.data.musicId){
                            control = false;
                        }
                    });
                    if (control) {
                     addMusicToMusicList({
                         variables:{
                                 musicId: create_response.data.musicId,
                                 musicListId: musicListId
                             }
                         });
                    } 
                 }else{
                    addMusicToMusicList({
                    variables:{
                            musicId: create_response.data.musicId,
                            musicListId: musicListId
                        }
                    });
                 }
               }
                 
                this.onClose();
           }else{
               alert("Playlist creation failed")
           }
        } catch (err) {
            console.log(err);
        }
    }

    updateModalContentHandler = (content) => {
        this.setState({modal_content: content})
    }

    childSongIdHandler(songID, songInfo) {
        this.setState({
            songID: songID,
            songInfo: songInfo
          })
    }

    render() {
        var search_results = this.state.search_results;
        var select = this.state.search_results_mode;
        var result_title_card = "";
        var result_cards = "";
        var userId = localStorage.getItem('userId');
        if(search_results ){ 
            if(select === "song" || select === "artist" || select === "album" ){
                result_title_card = <SongTitleCard></SongTitleCard>
                result_cards = search_results.slice((this.state.page-1)*10,this.state.page*10).map(result => {
                    return (
                    <SongCard 
                    updateModalContentHandler={this.updateModalContentHandler}
                    childSongIdHandler={this.childSongIdHandler}
                    loadQueueIndexToAudioPlayer={this.props.loadQueueIndexToAudioPlayer}
                    key={result.id} song={result}></SongCard>
                    );
                });
            }else if(select === "user"){
                result_title_card = <UserTitleCard></UserTitleCard>
                result_cards = search_results.slice((this.state.page-1)*10,this.state.page*10).map(result => {
                    return (
                        <UserCard key={result._id} user={result}></UserCard>
                    );
                });
            }else if(select === "playlist"){
                result_title_card = <PlaylistTitleCard></PlaylistTitleCard>
                result_cards = search_results.slice((this.state.page-1)*10,this.state.page*10).map(result => {
                    return (
                        <PlaylistCard key={result._id} playlist={result}></PlaylistCard>
                    );
                });
            }
        }
        
        return(
            <div>
                <br/><h1>Search</h1>
                <h6>Type to search:</h6>
                <form>
                    <div style={{"padding":"5px"}}>
                        <NativeSelect
                        defaultValue={"song"}
                        style={{"margin":"5px"}}
                        onChange={this.handleChange}
                        id="select"
                        >
                            <option value={"song"}>Song</option>
                            <option value={"artist"}>Artist</option>
                            <option value={"album"}>Album</option>
                            <option value={"user"}>User</option>
                            <option value={"playlist"}>Playlist</option>
                        </NativeSelect>
                        <TextField id="search_text" size="small" placeholder="search" variant="outlined" onChange={this.handleChange}/>
                        <Button onClick={this.onClick} type="submit" className="search-btn">Search</Button>
                    </div>
                    <br/><br/>
                    <div className="border-bottom-accent"></div>
                </form>
                { result_title_card }
                { result_cards }
                <Pagination count={parseInt(search_results.length/10+(search_results.length%10 > 0?1:0))} shape="rounded" size="large" onChange={this.changePageHandler}/>

                <div id="modal" className="modal">
                    <div className="modal-content">
                        <span onClick={this.onClose} className="close">&times;</span>
                        { this.state.modal_content }
                    </div>
                </div>

            </div>

        );
    }
}
export default SearchScreen;

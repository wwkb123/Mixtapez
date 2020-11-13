import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';
import { NativeSelect } from '@material-ui/core';
import UserAPI from "../apis/UserAPI";
import SongCard from "./SongCard.js";
import SongTitleCard from "./SongTitleCard.js";
import UserCard from "./UserCard.js";
import PlaylistCard from "./PlaylistCard.js";
import UserTitleCard from "./UserTitleCard.js";
import PlaylistTitleCard from "./PlaylistTitleCard.js";
import './modal.css';
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'

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
            songInfo: {}
        }
        this.childSongIdHandler = this.childSongIdHandler.bind(this)
    }

    handleChange = (e) => {
        const {target} = e;
    
        this.setState( (state) => ({
            ...state,
            [target.id]: target.value
    
        }));
    }

    onClick = async (e) => {
        e.preventDefault();
        var search_for = this.state.select;  // song/artist/album/user/playlist
        var search_text = this.state.search_text;
        console.log(search_for, search_text);
        if(search_text !== ""){  // not empty
            try {
                const response = await UserAPI.post("/search/"+search_for, {
                    search_text
                });
                if(response.data.status == "success"){ // search success
                    console.log("success");
                    // this.props.signedIn(response.data.nickName);
                    // this.props.history.push('/');
                    console.log(response.data.results);
                    this.setState({search_results: response.data.results});
                    this.setState({search_results_mode: search_for});
                }else{ // somehow failed
                    
                }
            }catch (err) {
                console.log(err);
            }
        }
    }

    onClose = () =>{
        var modal = document.getElementById("search_modal");
        modal.style.display = "none";
    }

    onAddPlaylistClick = async (e, musicListId, addMusicToMusicList, musics) => {
        e.preventDefault();
        var songID = this.state.songID;
        if(songID !== ""){
            console.log(musicListId, songID);
        }
        try {
            let musicName = this.state.songInfo.name;
            let artist = this.state.songInfo.artists[0].name;
            let URI = this.state.songID;
            let album = this.state.songInfo.album.name;
            
            const create_response = await UserAPI.post("/createMusic", {musicName,
                                                                    URI,
                                                                    album,
                                                                    artist});
            if (create_response.data.status == "success") {
               console.log(this.props.userId)
               console.log(create_response.data.musicId)
               let control = true;
               musics.forEach(mus => {
                   if(mus._id === create_response.data.musicId){
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
                this.onClose();
           }else{
               alert("Playlist creation failed")
           }
        } catch (err) {
            console.log(err);
        }
    }

    childSongIdHandler(songID, songInfo) {
        console.log(songID);
        console.log(songInfo);
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
        if(search_results.length > 0){
            if(select === "song" || select === "artist" || select === "album" ){
                result_title_card = <SongTitleCard></SongTitleCard>
                result_cards = search_results.map(result => {
                    return (
                    <SongCard childSongIdHandler={this.childSongIdHandler} key={result.id} song={result}></SongCard>
                    );
                });
            }else if(select === "user"){
                result_title_card = <UserTitleCard></UserTitleCard>
                result_cards = search_results.map(result => {
                    return (
                        <UserCard key={result._id} user={result}></UserCard>
                    );
                });
            }else if(select === "playlist"){
                result_title_card = <PlaylistTitleCard></PlaylistTitleCard>
                result_cards = search_results.map(result => {
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
                


                <div id="search_modal" className="modal">

                <div className="modal-content">
                    <span onClick={this.onClose} className="close">&times;</span>
                    <Query query={GET_PLAYLIST} variables={{userId: this.props.userId}}>
                    {({loading, error, data}) => 
                    {
                        if (loading) return 'Loading...';
                        if (error) return `Error! ${error.message}`;
                        if(data.user){  // check if user has signed in
                            return(<div>
                                {
                                
                                data.user.musicLists.map( (musicList) => 
                                        (<Query query={GET_LIST_DETAIL} variables={{musicListId: musicList._id}}
                                        key={musicList}>
                                        {({loading, error, data}) =>{
                                            if (loading) return 'Loading...';
                                            if (error) return `Error! ${error.message}`;
                                            if(data.musicList)
                                                console.log(data.musicList.owner);
                                            //return(<div></div>)
                                            if(data.musicList && data.musicList.owner){
                                                return(
                                                <Mutation mutation={ADD_MUSIC_TO_MUSICLIST}>
                                                    {(addMusicToMusicList, { loading, error }) => 
                                                    <div onClick={(e) => this.onAddPlaylistClick(e, musicList._id, addMusicToMusicList, data.musicList.musics)} className="playlist-card">
                                                        <div>{data.musicList.musicListName}</div>
                                                    </div>}
                                                </Mutation>
                                                
                                                
                                                
                                                )
                                            }else{
                                                return <></>
                                            }
                                        }                                   
                                    }
                                    </Query>))
                            }</div>)
                        }else{
                            return <></>
                        }
                        
                        }}</Query>
                </div>

                </div>
                

            </div>

        );
    }
}
export default SearchScreen;

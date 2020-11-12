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

class SearchScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            select: "song",
            search_text: "",
            search_results: [],
            search_results_mode: "song"
        }
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
                    <SongCard key={result._id} song={result}></SongCard>
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
                        <PlaylistCard key={result.id} playlist={result}></PlaylistCard>
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
            </div>

        );
    }
}
export default SearchScreen;

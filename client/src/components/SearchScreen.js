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

class SearchScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            select: "song",
            search_text: "",
            search_results: []
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
                }else{ // somehow failed
                    
                }
            }catch (err) {
                console.log(err);
            }
        }
    }

    render() {
        var search_results = this.state.search_results;
        var select = this.state.select;
        var result_title_card = "";
        var result_card = "";
        if(search_results.length > 0){
            if(select === "song" || select === "artist" || select === "album" ){
                result_title_card = <SongTitleCard></SongTitleCard>
                // result_card = 
            }else{
                result_title_card = <SongTitleCard></SongTitleCard>
                // result_card = <SongCard key={result.id} song={result}></SongCard>;
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
                            <option value={"playlist"}>Playlist</option>
                            <option value={"user"}>User</option>
                        </NativeSelect>
                        <TextField id="search_text" size="small" placeholder="search" variant="outlined" onChange={this.handleChange}/>
                        <Button onClick={this.onClick} type="submit" className="search-btn">Search</Button>
                    </div>
                    <br/><br/>
                    <div className="border-bottom-accent"></div>
                </form>
                { result_title_card }
                {search_results.map(result => {
                    return (
                    <SongCard key={result.id} song={result}></SongCard>
                    );
                })}
            </div>

        );
    }
}
export default SearchScreen;

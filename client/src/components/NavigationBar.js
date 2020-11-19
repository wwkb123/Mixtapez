import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import UserAPI from "../apis/UserAPI";
import { withRouter } from "react-router-dom";
import { TextField } from '@material-ui/core';

const ADD_PLAYLIST=gql`
    mutation AddNewPlaylist(
        $id: String!,
        $playlistId: String!,
        ) {
        addNewPlaylist(
            id: $id,
            playlistId: $playlistId
            ) {
            _id
        }
    }
`;

class NavigationBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            playlist: "",
            musicListName: ""
        }
    }

    handleChange = (e) => {
        const {target} = e;
    
        this.setState( (state) => ({
            ...state,
            [target.id]: target.value
    
        }));
    }

    selectButtons = () =>{
        if(localStorage.getItem('isSignedIn')){
            return(<div>
                <Link to="/friends"><Button className="nav-btn" size="lg">Friends</Button></Link>
                <Link to="/playlists"><Button className="nav-btn" size="lg">Playlists</Button></Link>
                <Mutation mutation={ADD_PLAYLIST}>
                    {(addNewPlaylist,{loading, error})=>(
                        //<Link to={'/playlist/${this.state.playlist}'}>
                            // <Button className="nav-btn" size="lg" onClick={(e) => this.handleCreateNewList(e, addNewPlaylist)}>
                            <Button className="nav-btn" size="lg" onClick={(e) => this.openModal(e, addNewPlaylist)}>
                                Create Playlist
                            </Button>
                        //</Link>
                    )}
                </Mutation>
                <Link to="/likedsongs"><Button className="nav-btn" size="lg">Liked Songs</Button></Link>
                <Button className="nav-btn" size="lg" onClick={()=>{this.props.signedOut()}}>Sign Out</Button>
                </div>)
        }
        else{
            return(<div>
                <Link to="/signin"><Button className="nav-btn" size="lg">Sign In</Button></Link>
                <Link to="/signup"><Button className="nav-btn" size="lg">Sign Up</Button></Link>
            </div>)
        }
    }

    setMusicListNameHandler = (e, addNewPlaylist) => {
        console.log(this.state.musicListName);
        var musicListName = this.state.musicListName;
        if(musicListName === "") return;
        this.handleCreateNewList(addNewPlaylist, musicListName);
    }

    openModal = (e, addNewPlaylist) => {
        if(localStorage.getItem('isSignedIn')){
            var modal = document.getElementById("main_modal");
            if(modal){
                modal.style.display = "block";
                var updateModalContentHandler = this.props.updateModalContentHandler;
                var content = <div>
                    <h2>Create New Playlist</h2>
                    <div style={{"padding":"5px"}}>
                        <TextField id="musicListName" size="small" placeholder="New List" variant="outlined" onChange={this.handleChange} />
                    </div>
                    <Button className="search-btn" onClick={(e) => this.setMusicListNameHandler(e, addNewPlaylist)}>Create</Button>
                    <Button className="cancel-btn" onClick={this.closeModal}>Cancel</Button>
                    </div>
                updateModalContentHandler(content);
            }
        }else{
            alert("Please sign in first!");
        }
    }

    closeModal = () =>{
        var modal = document.getElementById("main_modal");
        modal.style.display = "none";
    }

    handleCreateNewList = async (addNewPlaylist, musicListName) => {
        // e.preventDefault();
        try {
            let userId = localStorage.getItem('userId');
            const create_response = await UserAPI.post("/createMusicList", {
                userId,
                musicListName
            });
            if (create_response.data.status == "success") {
            //    console.log(this.props.userId)
            //    console.log(create_response.data.musicListId)
                addNewPlaylist({
                    variables:{
                        id: userId,
                        playlistId: create_response.data.musicListId
                    }
                });
                this.closeModal();
                this.props.history.push('/playlist/'+create_response.data.musicListId);
            }else{
                alert("Playlist creation failed")
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div>
                <Link to="/"><Button className="nav-btn" size="lg">Home</Button></Link>
                <Link to="/search"><Button className="nav-btn" size="lg">Search</Button></Link>
                {this.selectButtons()}
                {/* <Link to="/signin"><Button className="nav-btn" size="lg">Sign In</Button></Link>
                <Link to="/signup"><Button className="nav-btn" size="lg">Sign Up</Button></Link> */}
            </div>

        );
    }
}
export default withRouter(NavigationBar);

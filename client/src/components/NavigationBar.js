import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import UserAPI from "../apis/UserAPI";

const ADD_PLAYLIST=gql`
mutation AddNewPlayList(
    $id: String!,
    $playlistId: String!,
    ) {
    addNewPlayList(
        id: $id,
        playlistId: $playlistId
        ) 
}
`;

class NavigationBar extends Component{
    constructor(props){
        super(props);
    }

    selectButtons = () =>{
        if(this.props.signedUp){
            return(<Button className="nav-btn" size="lg" onClick={()=>{this.props.signedOut()}}>Sign Out</Button>)
        }
        else{
            return(<div>
                <Link to="/signin"><Button className="nav-btn" size="lg">Sign In</Button></Link>
                <Link to="/signup"><Button className="nav-btn" size="lg">Sign Up</Button></Link>
            </div>)
        }
    }

    handleCreateNewList = async (e, addNewPlayList) =>{
        e.preventDefault();
        console.log("Button Pressed");
        if(this.props.signedUp){
            try {
               const create_response = await UserAPI.post("/createMusicList", {});
               if (create_response.data.status == "success") {
                   addNewPlayList({
                       variables:{
                           id: this.props.userId,
                           playlistId: create_response.data.musicListId
                       }
                   });
               }else{
                   alert("Playlist creation failed")
               }
            } catch (err) {
                console.log(err);
            }
        }
        else{
            alert("please sign in first");
        }
    }

    render() {
        return(
            <div>
                <Link to="/"><Button className="nav-btn" size="lg">Home</Button></Link>
                <Link to="/search"><Button className="nav-btn" size="lg">Search</Button></Link>
                <Link to="/friends"><Button className="nav-btn" size="lg">Friends</Button></Link>
                <Link to="/playlists"><Button className="nav-btn" size="lg">Playlists</Button></Link>
                <Mutation mutation={ADD_PLAYLIST}>
                    {(addNewPlayList,{loading, error})=>(
                        <Link to="/create">
                            <Button className="nav-btn" size="lg" onClick={(e) => this.handleCreateNewList(e, addNewPlayList)}>
                                Create Playlist
                            </Button>
                        </Link>
                    )}
                </Mutation>
                <Link to="/likedsongs"><Button className="nav-btn" size="lg">Liked Songs</Button></Link>
                {this.selectButtons()}
                {/* <Link to="/signin"><Button className="nav-btn" size="lg">Sign In</Button></Link>
                <Link to="/signup"><Button className="nav-btn" size="lg">Sign Up</Button></Link> */}
            </div>

        );
    }
}
export default NavigationBar;

import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import { Link } from 'react-router-dom';
import {AiFillEdit} from 'react-icons/ai'
import {BsTrashFill} from 'react-icons/bs'
import { IconContext } from "react-icons";
import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'
import EditNamePopup from './EditNamePopup'
import UserAPI from "../../apis/UserAPI";
import Button from 'react-bootstrap/Button'

const REMOVE_PLAYLIST = gql`
    mutation removePlaylist($userId: String!
                            $playlistId: String!
        ) {
        removePlaylist(
            id: $userId
            playlistId: $playlistId
        ){
            _id
        }
    }
`;

const EDIT_MUSICLIST = gql`
    mutation updateMusicList(
        $musicListId: String!
        $musicListNewName: String!
        $isPublic: Boolean!
    ) {
    updateMusicList(
        id: $musicListId
        musicListName: $musicListNewName
        isPublic: $isPublic
    ){
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

class PlaylistCard extends Component {
    constructor(props){
        super(props);
        this.state={
            popupDisplay: false
        }
    }

    closeModal = () =>{
        var modal = document.getElementById("main_modal");
        modal.style.display = "none";
    }

    onDeleteClick = (e, removePlaylist, removeMusicList) => {
        if(localStorage.getItem('isSignedIn')){
            var modal = document.getElementById("main_modal");
            if(modal){
                modal.style.display = "block";
                var updateModalContentHandler = this.props.updateModalContentHandler;
                var content = <div>
                    <h3>Are you sure to delete the playlist "{this.props.musicListName}"?</h3>
                    <Button className="search-btn" onClick={(e) => this.onDeleteConfirm(e, removePlaylist, removeMusicList)}>Confirm</Button>
                    <Button className="cancel-btn" onClick={this.closeModal}>Cancel</Button>
                    </div>
                updateModalContentHandler(content);
            }
        }else{
            alert("Please sign in first!");
        }
    }

    onDeleteConfirm = async (e, removePlaylist, removeMusicList)=>{
        e.preventDefault();
        removePlaylist({
            variables:{
                userId: this.props.userId,
                playlistId: this.props.musicListId
            }
        });
        removeMusicList({
            variables:{
                playlistId: this.props.musicListId
            }
        });
        try{
            const response = await UserAPI.get("/musicListRoute/user/musicLists/"+this.props.userId);
            if(response.data.status === "success"){ // search success
                var playlistsChangeHandler = this.props.handler;
                playlistsChangeHandler(response.data.musicLists);
            }
        }catch(err){
            console.log(err);
        }
        this.closeModal();
    
    }

    handleEditOnClick = () =>{
        this.setState({
            popupDisplay: true
        })
    }

    handleCloseOnClick = () =>{
        this.setState({
            popupDisplay: false
        })
    }


    render() {
        var playlistID = this.props.musicListId;
        var link = "/playlist/"+playlistID;
        let deleteButton = <Mutation mutation={REMOVE_PLAYLIST}>
                                {(removePlaylist, { loading, error }) => 
                                <Mutation mutation={REMOVE_MUSICLIST}>
                                        {(removeMusicList, { loading, error }) => 
                                            <BsTrashFill onClick={(e) => this.onDeleteClick(e,removePlaylist, removeMusicList )}/> }
                                </Mutation>}
                        </Mutation>    
        let editButton = null;
        if(this.props.userId === this.props.ownerId){
            editButton = <AiFillEdit onClick={this.handleEditOnClick}/>
        }
        return (
            <Row>
                <Link to={link}>
                    <div className="playlist-card">
                        <div>{this.props.musicListName}</div>
                    </div>
                </Link>
                <div style={{'cursor':'pointer'}}>
                    <IconContext.Provider value={{ color: "#F06E9C", size: '35px' }}>
                        {editButton}
                        {deleteButton} 
                    </IconContext.Provider>
                </div>
                <Mutation mutation={EDIT_MUSICLIST}>
                                {(updateMusicList, { loading, error }) => 
                                    <EditNamePopup
                                    updateMusicList ={updateMusicList}
                                    musicListId = {playlistID}
                                    show = {this.state.popupDisplay}
                                    userId={this.props.userId}
                                    ownerId = {this.props.ownerId}
                                    handler={this.props.handler}
                                    handleClose = {this.handleCloseOnClick}
                                    isPublic={this.props.isPublic}
                                    />}
                </Mutation>
            </Row>
        );
    }
}

export default PlaylistCard

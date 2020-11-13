import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import data from '../Mixtapez_data.json'
import {AiFillEdit} from 'react-icons/ai'
import {BsTrashFill} from 'react-icons/bs'
import { IconContext } from "react-icons";
import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'
import EditNamePopup from './EditNamePopup'

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

    handleDeleteOnClick = async (e, removePlaylist, removeMusicList)=>{
        e.preventDefault();
        console.log('click to remove');
        if(true){
            console.log(this.props.userId);
            console.log(this.props.musicListId);
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
        }
    }

    handleEditOnClick = () =>{
        console.log('click to edit');
        this.setState({
            popupDisplay: true
        })
    }

    handleCloseOnClick = () =>{
        console.log('click to close');
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
                                            <BsTrashFill onClick={(e) => handleOnClick(e,removePlaylist, removeMusicList )}/> }
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
                <IconContext.Provider value={{ color: "#F06E9C", size: '45px' }}>
                    {deleteButton}
                    {editButton}
                </IconContext.Provider>
                <Mutation mutation={EDIT_MUSICLIST}>
                                {(updateMusicList, { loading, error }) => 
                                    <EditNamePopup
                                    updateMusicList ={updateMusicList}
                                    musicListId = {playlistID}
                                    show = {this.state.popupDisplay}
                                    ownerId = {this.props.ownerId}
                                    handleClose = {this.handleCloseOnClick}
                                    isPublic={this.props.isPublic}
                                    />}
                </Mutation>
            </Row>
        );
    }
}

export default PlaylistCard

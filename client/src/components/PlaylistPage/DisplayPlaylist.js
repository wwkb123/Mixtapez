import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../../tempData/AbbeyRoad.jpg'
import { MdPauseCircleOutline, MdMoreHoriz} from "react-icons/md";
import {IoMdHeartEmpty} from "react-icons/io"
import { IconContext } from "react-icons";
import Button from 'react-bootstrap/Button'
import { Grid, Paper } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import gql from 'graphql-tag'
import MusicCard from './MusicCard'
import {Query, Mutation} from 'react-apollo'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const GET_LIST_DETAIL = gql`
    query musicList($musicListId: String) {
        musicList(id: $musicListId) {
            musicListName
            musics{
                _id
            }
            owner{
                _id
            }
            isPublic
        }
    }
`;

const GET_PLAYLIST = gql`
    query user($userId: String) {
        user(id: $userId) {
            nickName
        }
    }
`;

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

const UPDATE_MUSICLIST = gql`
    mutation updateMusicList(
        $playlistId: String!
        $musicListName: String!
        $isPublic: Boolean!
        ) {
            updateMusicList(
                id: $playlistId
                musicListName: $musicListName
                isPublic: $isPublic
            ){
                _id
            }
    }
`;

const options = [
    'Make Private',  // should toggle with Make Public
    'Edit Details',
    'Delete',
    'Share'
  ];

export default function DisplayPlaylistScreen(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleMenuItemClick = (event, index, isPublic, isOwner, updateMusicList, musicListName) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if(index === 0){  // add to queue
            if(isOwner){
                if(isPublic){
                    options[0] = "Make Private";
                }else{
                    options[0] = "Make Public";
                }
                updateMusicList({
                    variables: {
                        playlistId: props.match.params.id,
                        musicListName: musicListName,
                        isPublic: !isPublic
                    }
                });
            }else{
                alert("you do not own the playlist")
            }
        }else if(index === 1){ // add to liked songs

        }else if(index === 2){ // add to playlist
            // if(song){
            //     // alert("hi" + song.name);
            //     // console.log(song.name, "asdad");
            //     var modal = document.getElementById("search_modal");
            //     if(modal){
            //         var handler = props.childSongIdHandler;
            //         // console.log(handler)
            //         modal.style.display = "block";
            //         handler(song.id,song);
            //     }
                    
            // }
        }else if(index === 3){ // share

        }
    };

    const handleOnClick = async (e, removePlaylist, removeMusicList) =>{
        e.preventDefault();
        console.log('click to remove');
        if(true){
            console.log(props.userId);
            console.log(props.match.params.id);
            removePlaylist({
                variables:{
                    userId: props.userId,
                    playlistId: props.match.params.id
                }
            });
            removeMusicList({
                variables:{
                    playlistId: props.match.params.id
                }
            });
            props.history.push('/playlists');
        }
    }

    console.log(props.match.params.id);
    let deleteButton = null;
    return(
        <div>
            <Query pollInterval={1000} query={GET_LIST_DETAIL} variables={{musicListId: props.match.params.id}}>
                {({loading, error, data}) =>{
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    let numberOfMusics = data.musicList.musics.length;
                    if (props.userId === data.musicList.owner._id) {
                        deleteButton = <Mutation mutation={REMOVE_PLAYLIST}>
                                {(removePlaylist, { loading, error }) => 
                                <Mutation mutation={REMOVE_MUSICLIST}>
                                        {(removeMusicList, { loading, error }) => 
                                            <BsTrashFill onClick={(e) => handleOnClick(e,removePlaylist, removeMusicList )}/> }
                                </Mutation>}
                        </Mutation>                            
                    }
                    return(
                        <div>
                            <Row>
                                <img src={Image} width={175} height={175} alt="">
                                </img>
                                <Col>
                                    <Col xs={10} className="content-left">
                                        <h3>Playlists</h3>
                                        <h1 style={{fontWeight: "bold"}} >{data.musicList.musicListName} </h1> 
                                    </Col>
                                    <Col xs={10} className="content-center">
                                        <Query query={GET_PLAYLIST} variables={{userId: data.musicList.owner._id}}>
                                            {({loading, error, data}) => 
                                                {                                                    
                                                    if (loading) return 'Loading...';
                                                    if (error) return `Error! ${error.message}`;
                                                    console.log(data);
                                                    return(
                                                        <div>
                                                            <h5>Artirst</h5>                    
                                                            <h3 style={{fontWeight: "bold"}} >{data.user.nickName}|{numberOfMusics} Song|0 second</h3>
                                                        </div>
                                                    )
                                                }
                                            }
                                        </Query>                                            
                                    </Col>
                                </Col>
                            </Row>
                            <Row xs={10}>
                                <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                                    <MdPauseCircleOutline/>
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
                                        <Mutation mutation={UPDATE_MUSICLIST}>
                                           {(updateMusicList,{loading, error})=>
                                            <MenuItem
                                                key={option}
                                                onClick={(event) => handleMenuItemClick(event, index, 
                                                    data.musicList.isPublic, (props.userId === data.musicList.owner._id),
                                                    updateMusicList, data.musicList.musicListName
                                                )}
                                            >
                                                {option}
                                            </MenuItem>}
                                        </Mutation>
                                        ))}
                                    </Menu>
                                    </IconContext.Provider>
                                </Row>   
                                                         
                                <MusicCard 
                                musics={data.musicList.musics} 
                                isOwner={props.userId === data.musicList.owner._id} 
                                musicListId={props.match.params.id}/>
                            </div>
                        )
                    }                                   
                    }
                </Query>              
            </div>

        );

}



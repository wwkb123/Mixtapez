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

class DisplayPlaylistScreen extends Component{
    constructor(props){
        super(props);
    }

    handleOnClick = async (e, removePlaylist, removeMusicList) =>{
        e.preventDefault();
        console.log('click to remove');
        if(true){
            console.log(this.props.userId);
            console.log(this.props.match.params.id);
            removePlaylist({
                variables:{
                    userId: this.props.userId,
                    playlistId: this.props.match.params.id
                }
            });
            removeMusicList({
                variables:{
                    playlistId: this.props.match.params.id
                }
            });
            this.setState();
            this.props.history.push('/playlists');
        }
    }
    render(){
        console.log(this.props.match.params.id);
        let deleteButton = null;
        return(
            <div>
                <Query pollInterval={1000} query={GET_LIST_DETAIL} variables={{musicListId: this.props.match.params.id}}>
                    {({loading, error, data}) =>{
                        if (loading) return 'Loading...';
                        if (error) return `Error! ${error.message}`;
                        let numberOfMusics = data.musicList.musics.length;
                        if (this.props.userId === data.musicList.owner._id) {
                            deleteButton = <Mutation mutation={REMOVE_PLAYLIST}>
                                 {(removePlaylist, { loading, error }) => 
                                    <Mutation mutation={REMOVE_MUSICLIST}>
                                         {(removeMusicList, { loading, error }) => 
                                                <BsTrashFill onClick={(e) => this.handleOnClick(e,removePlaylist, removeMusicList )}/> }
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
                                        <AiOutlinePlusCircle/>
                                        {deleteButton}
                                        <MdMoreHoriz/>
                                    </IconContext.Provider>
                                </Row>   
                                                         
                                <MusicCard musics={data.musicList.musics}/>
                            </div>
                        )
                    }                                   
                    }
                </Query>              
            </div>
           
        )
    };

}

export default DisplayPlaylistScreen;
import React, { Component, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import UserAPI from "../../apis/UserAPI";

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
            isPublic
        }
    }
`;

export default function PlaylistsScreen(props){
    const [playlists, setPlaylists] = React.useState(null);

    useEffect(() => {
        var userId = props.userId;
        async function fetchData() {
            if(userId){
                try {
                    const response = await UserAPI.get("/user/musicLists/"+userId);
                    if(response.data.status == "success"){ // search success
                        console.log("success");
                        console.log("musiclists is", response.data.musicLists);
                        var musicLists = [];
                        for(let i = 0; i < response.data.musicLists.length; i++){
                            let id = response.data.musicLists[i];
                            const playlist_response = await UserAPI.get("/musicList/"+id);
                            if(playlist_response.data.status == "success"){ // search success
                                musicLists.push(playlist_response.data.musicList);
                            }else{
                                console.log("error searching playlist", id);
                            }
                        }
                        setPlaylists(Array.from(musicLists));
                    }else{ // somehow failed
        
                    }
                }catch (err) {
                    console.log(err);
                }
            }
            
        }
        fetchData();
    }, []);

    if(!props.userId){  // or current logged in id is not equal to this id
        props.history.push('/signin');
    }
    if(playlists){
        return (
            <div>
                <br/><h1>All Playlists</h1>
                {playlists.map( (musicList) => 
                    <PlaylistCard
                    key={musicList._id}
                    userId={props.userId}
                    musicListId={musicList._id}
                    musicListName={musicList.musicListName}
                    ownerId={musicList.owner}/>
                )}   
            </div>
        );
    }else{
        return(
            <div>Loading...</div>
        );
    }
}
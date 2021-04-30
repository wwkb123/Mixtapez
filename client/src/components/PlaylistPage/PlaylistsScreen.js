import React, { useEffect } from 'react';
import PlaylistCard from './PlaylistCard';
import gql from 'graphql-tag'
import UserAPI from "../../apis/UserAPI";
import { TextField } from '@material-ui/core';

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
    const [filter_criteria, setFilterCriteria] = React.useState("");
    var userId = localStorage.getItem('userId');
    
    const handler = async (musicLists) => {
        var newMusicLists = [];
        for(let i = 0; i < musicLists.length; i++){
            let id = musicLists[i];
            const playlist_response = await UserAPI.get("/musicListRoute/musicList/"+id);
            if(playlist_response.data.status === "success"){ // search success
                newMusicLists.push(playlist_response.data.musicList);
            }else{
                console.log("error searching playlist", id);
            }
        }
        setPlaylists(Array.from(newMusicLists));
    }

    const updateNavBar = () => {
        var navbtns = document.getElementsByClassName("nav-btn");
        if(navbtns){
            for(let i = 0; i < navbtns.length; i++){
                if(navbtns[i]){
                    if(navbtns[i].id === "playlists"){
                        navbtns[i].classList.add("curr-page");
                    }else{
                        navbtns[i].classList.remove("curr-page");
                    }
                }
            }
        }
    }

    useEffect(() => {
        
        async function fetchData() {
            if(userId){
                try {
                    const response = await UserAPI.get("/musicListRoute/user/musicLists/"+userId);
                    if(response.data.status === "success"){ // search success
                        var musicLists = [];
                        for(let i = 0; i < response.data.musicLists.length; i++){
                            let id = response.data.musicLists[i];
                            const playlist_response = await UserAPI.get("/musicListRoute/musicList/"+id);
                            if(playlist_response.data.status === "success"){ // search success
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
        updateNavBar();
    }, []);

    const handleFilter = (e) => {
        const {target} = e;
        setFilterCriteria(target.value);
    }

    if(!userId){  // or current logged in id is not equal to this id
        props.history.push('/signin');
    }
    if(playlists){
        var playlists_cards = ""
        if(playlists.length > 0){
            playlists_cards = playlists.filter(musicList => musicList.musicListName.toLowerCase().includes(filter_criteria.toLowerCase())).map( (musicList) => 
            <PlaylistCard
            key={musicList._id}
            isPublic={musicList.isPublic}
            userId={userId}
            musicListId={musicList._id}
            musicListName={musicList.musicListName}
            ownerId={musicList.owner}
            updateModalContentHandler={props.updateModalContentHandler}
            handler={handler}/>
            ) 
        }else{
            playlists_cards = <div>You don't have any playlist. Click "Create Playlist" to make a new one.</div>
        }
        
        return (
            <div>
                
                <br/><h1>All Playlists</h1>
                
                <div style={{"padding":"5px"}}>
                    <TextField size="small" placeholder="Filter..." variant="outlined" 
                    id="filter" onChange={handleFilter}/>
                </div>
                { playlists_cards }
                 
            </div>
        );
    }else{
        return(
            <div>Loading...</div>
        );
    }
}
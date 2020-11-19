import React, { Component, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../tempData/AbbeyRoad.jpg'
import { MdPauseCircleOutline, MdMoreHoriz} from "react-icons/md";
import {IoMdHeartEmpty} from "react-icons/io"
import { IconContext } from "react-icons";
import Button from 'react-bootstrap/Button'
import { Grid, Paper } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserAPI from "../apis/UserAPI";
import SongCard from "./PlaylistPage/SongCard";
import SongTitleCard from './SongTitleCard';

import Reorder, {
    reorder,
    reorderImmutable,
    reorderFromTo,
    reorderFromToImmutable
  } from 'react-reorder';


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

const options = [
    'Make Private',  // should toggle with Make Public
    'Edit Details',
    'Delete',
    'Share'
  ];

export default function QueueScreen(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [musics, setMusics] = React.useState([]);
    const [owner, setOwner] = React.useState(null);
    const [reorder_mode, setReOrderMode] = React.useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const updatePlaylist = async () => {  // use setstate to trigger re-render
        try{
                var musics = [];
                for(let i = 0; i < props.queue.length; i++){
                    let id = props.queue[i];
                    const song_response = await UserAPI.get("/music/"+id);
                    if(song_response.data.status == "success"){ // search success
                        musics.push(song_response.data.music);
                    }else{
                        console.log("error searching song", id);
                    }
                }
                setMusics(Array.from(musics)); // deep copy
                setOwner(localStorage.getItem('user'));
                console.log("owner", localStorage.getItem('user'));
            
        }catch(err){
            console.log(err);
        }
    }


    useEffect(() => {
        async function fetchData() {
            try{
                console.log(props.queue);
                setMusics(Array.from(props.queue)); // deep copy
                setOwner(localStorage.getItem('user'));
                console.log("owner", localStorage.getItem('user'));
            }catch(err){
                console.log(err);
            }
                }
        fetchData();
      }, []);
    
    function onReorder (event, previousIndex, nextIndex, fromId, toId) {
        setMusics(reorder(musics, previousIndex, nextIndex));
    }

    const onReOrderClick = () => {
        setReOrderMode(true);
    }

    const onSaveClick = () => {
        if(reorder_mode){
            // save changes to backend

            setReOrderMode(false);  // turn off reorder_mode
        }
    }
    let deleteButton = null;
    let reorderButtons = null;
    if(owner){
        reorderButtons =<div>
                            <Button className="search-btn" onClick={onReOrderClick}>Re-Order</Button>
                            <Button className="search-btn" onClick={onSaveClick}>Save</Button>
                        </div>       
        var songcards = null;
        if(reorder_mode){
            songcards = <Reorder
                reorderId="my-list" // Unique ID that is used internally to track this list (required)
                reorderGroup="reorder-group" // A group ID that allows items to be dragged between lists of the same group (optional)
                component="div"
                placeholderClassName="placeholder" // Class name to be applied to placeholder elements (optional), defaults to 'placeholder'
                draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
                lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
                holdTime={0} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
                onReorder={onReorder} // Callback when an item is dropped (you will need this to update your state)
                autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
                disabled={false} // Disable reordering (optional), defaults to false
                disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
            >
                {musics.map((music, index) => (
                    <div key={music._id}><SongCard updatePlaylist={updatePlaylist} musicListId={""} song={music}></SongCard></div>
                ))}
            </Reorder>
        }else{
            songcards = <div>{musics.map((music, index) => (
                <div key={music._id}><SongCard updatePlaylist={updatePlaylist} musicListId={""} song={music}></SongCard></div>
            ))}</div>
        }
        var playlist_type = "";
        
        return(
            <div>
                <Row>
                    <img src={Image} width={175} height={175} alt="">
                    </img>
                    <Col>
                        <h1 style={{fontWeight: "bold"}} >Current Queue </h1>              
                        <h4 style={{fontWeight: "bold"}} >{owner.nickName} | {musics.length} Songs | 0 second</h4>
                        <h4 style={{fontWeight: "bold"}}> {playlist_type}</h4>
                    </Col>
                </Row>
                <Row xs={10}>
                    <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                        <MdPauseCircleOutline/>
                        { reorderButtons }
                        {/* <AiOutlinePlusCircle/> */}
                        {deleteButton}
                    </IconContext.Provider>
                </Row>
                
                <SongTitleCard></SongTitleCard>
                { songcards }
                
            </div>
    
        );
    }else{
        return(
            <div>Loading...</div>
        );
    }
    

}





// class QueueScreen extends Component{
    
//     render() {
//         return(
//             <div>
//                 <br/><h1>Queue</h1>
//                 <Button style={{"width":"10%"}} className="nav-btn">Save</Button>
//                 <br/>
//                 <Container>
//                     <Row className="border-bottom-accent">
//                         <Col xs={2}>
//                             Like
//                         </Col>
//                         <Col xs={2}>
//                             Title
//                         </Col>
//                         <Col xs={2}>
//                             Artist
//                         </Col>
//                         <Col xs={2}>
//                             Album
//                         </Col>
//                         <Col xs={2}>
//                             Time
//                         </Col>
//                         <Col xs={2}>
//                             Options
//                         </Col>
//                     </Row>
//                     <Row className="border-bottom-accent">
//                         <Col xs={2}>
//                             &#9825;
//                         </Col>
//                         <Col xs={2}>
//                             Song1
//                         </Col>
//                         <Col xs={2}>
//                             ABC
//                         </Col>
//                         <Col xs={2}>
//                             AAA
//                         </Col>
//                         <Col xs={2}>
//                             01:11
//                         </Col>
//                         <Col xs={2}>
//                             ...
//                         </Col>
//                     </Row>
//                     <Row className="border-bottom-accent">
//                         <Col xs={2}>
//                             &#9825;
//                         </Col>
//                         <Col xs={2}>
//                             Nice Song
//                         </Col>
//                         <Col xs={2}>
//                             Him
//                         </Col>
//                         <Col xs={2}>
//                             That album
//                         </Col>
//                         <Col xs={2}>
//                             02:02
//                         </Col>
//                         <Col xs={2}>
//                             ...
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//         );
//     }
// }
// export default QueueScreen;

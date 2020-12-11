import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import UserAPI from "../apis/UserAPI";
import { withRouter } from "react-router-dom";
import { TextField } from '@material-ui/core';
import { MdHome, MdSearch, MdPerson, MdPeople, 
    MdQueueMusic, MdPlaylistAdd, MdAssignment
} from "react-icons/md";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { IconContext } from "react-icons";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
            let userId = localStorage.getItem('userId');
            return(<div>
                <Link to={"/profile/"+userId}>
                    <Button className="nav-btn" id="profile" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <MdPerson style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                My Profile
                            </Col>
                        </Row>
                    </Button>
                </Link>
                <Link to="/friends">
                    <Button className="nav-btn" id="friends" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <MdPeople style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                Friends
                            </Col>
                        </Row>
                    </Button>
                </Link>
                <Link to="/playlists">
                    <Button className="nav-btn" id="playlists" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <MdQueueMusic style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                Playlists
                            </Col>
                        </Row>
                    </Button>
                </Link>
                <Mutation mutation={ADD_PLAYLIST}>
                    {(addNewPlaylist,{loading, error})=>(
                        //<Link to={'/playlist/${this.state.playlist}'}>
                            // <Button className="nav-btn" size="lg" onClick={(e) => this.handleCreateNewList(e, addNewPlaylist)}>
                            <Button className="nav-btn" size="lg" onClick={(e) => this.openModal(e, addNewPlaylist)}>
                                <Row>
                                    <Col xs={2}>
                                        <IconContext.Provider value={{ size: '30px' }}>
                                            <MdPlaylistAdd style={{'paddingBottom':'5px'}}/>
                                        </IconContext.Provider>
                                    </Col>
                                    <Col xs={10}>
                                        Create Playlist
                                    </Col>
                                </Row>
                            </Button>
                        //</Link>
                    )}
                </Mutation>

                {/* <Link to="/likedsongs">
                    <Button className="nav-btn" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <MdFavorite style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                Liked Songs
                            </Col>
                        </Row>
                    </Button>
                </Link> */}

                <Button className="nav-btn" size="lg" onClick={()=>{this.props.signedOut()}}>
                    <Row>
                        <Col xs={2}>
                            <IconContext.Provider value={{ size: '30px' }}>
                                <CgLogOut style={{'paddingBottom':'5px'}}/>
                            </IconContext.Provider>
                        </Col>
                        <Col xs={10}>
                            Sign Out
                        </Col>
                    </Row>
                </Button>
                </div>)
        }
        else{
            return(<div>
                <Link to="/signin">
                    <Button className="nav-btn" id="signin" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <CgLogIn style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                Sign In
                            </Col>
                        </Row>
                    </Button>
                </Link>
                <Link to="/signup">
                    <Button className="nav-btn" id="signup" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <MdAssignment style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                Sign Up
                            </Col>
                        </Row>
                    </Button>
                </Link>
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
            if (create_response.data.status === "success") {
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
                <Link to="/">
                    <Button className="nav-btn" id="home" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <MdHome style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                Home
                            </Col>
                        </Row>
                    </Button>
                </Link>
                <Link to="/search">
                    <Button className="nav-btn" id="search" size="lg">
                        <Row>
                            <Col xs={2}>
                                <IconContext.Provider value={{ size: '30px' }}>
                                    <MdSearch style={{'paddingBottom':'5px'}}/>
                                </IconContext.Provider>
                            </Col>
                            <Col xs={10}>
                                Search
                            </Col>
                        </Row>
                    </Button>
                </Link>
                {this.selectButtons()}
                {/* <Link to="/signin"><Button className="nav-btn" size="lg">Sign In</Button></Link>
                <Link to="/signup"><Button className="nav-btn" size="lg">Sign Up</Button></Link> */}
            </div>

        );
    }
}
export default withRouter(NavigationBar);

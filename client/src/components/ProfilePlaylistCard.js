import React, { Component } from 'react';
import Image from '../tempData/AbbeyRoad.jpg'
import default_image from '../tempData/default_image.png'
import { Link } from 'react-router-dom';
import UserAPI from '../apis/UserAPI'

class ProfilePlaylistCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            owner: ""
        }
    }

    getNickName = async (id) => {
        var owner = "";
        try {
            const response = await UserAPI.post("/user/nickName", {
                id: id
            });
            if(response.data.status === "success"){ // search success
                console.log("success");
                owner = response.data.nickName;
                this.setState({owner});
            }else{ // somehow failed
                
            }
        }catch (err) {
            console.log(err);
        }
    }

    componentDidMount() {
        var playlist = this.props.playlist;
        if(playlist){
            this.getNickName(playlist.owner);
        }
        
    }

    render() {
        var playlist = this.props.playlist
        var owner = ""
        if(this.state.owner){
            owner = this.state.owner
        }
        return (
            <div>
                <Link to={"/playlist/"+playlist._id} style={{'color':'#ed4e85'}}>
                    <div className="album-card">
                        <img className="playlist-image" src={default_image} width={150} height={150} alt=""/>
                        <div>{playlist.musicListName}</div>
                        <div style={{'fontSize':'12px', 'color':'#ACACAC'}}>By {owner}</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default ProfilePlaylistCard;

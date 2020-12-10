import React, { Component } from 'react';
import Image from '../tempData/AbbeyRoad.jpg'
import default_image from '../tempData/default_image.png'
import { Link } from 'react-router-dom';

class ProfilePlaylistCard extends Component {

    render() {
        var playlist = this.props.playlist
        return (
            <div>
                <Link to={"/playlist/"+playlist._id} style={{'color':'#ed4e85'}}>
                    <div className="album-card">
                        <img className="playlist-image" src={default_image} width={150} height={150} alt=""/>
                        <div>{playlist.musicListName}</div>
                        {/* <div style={{'fontSize':'12px', 'color':'#ACACAC'}}>By {playlist.owner}</div> */}
                    </div>
                </Link>
            </div>
        );
    }
}

export default ProfilePlaylistCard;

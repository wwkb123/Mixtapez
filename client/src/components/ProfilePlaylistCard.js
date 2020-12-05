import React, { Component } from 'react';
import Image from '../tempData/AbbeyRoad.jpg'
import { Link } from 'react-router-dom';

class ProfilePlaylistCard extends Component {

    render() {
        var playlist = this.props.playlist
        return (
            <div>
                <Link to={"/playlist/"+playlist._id} style={{'color':'#ed4e85'}}>
                    <div className="album-card">
                        <img src={Image} width={150} height={150} alt=""/>
                        <div>{playlist.musicListName}</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default ProfilePlaylistCard;

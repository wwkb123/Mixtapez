import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../tempData/AbbeyRoad.jpg'
import { Link } from 'react-router-dom';

class ProfilePlaylistCard extends Component {

    render() {
        var playlist = this.props.playlist
        return (
            <div>
                <Link to={"/playlist/"+playlist._id} style={{'color':'#ed4e85'}}>
                    <div className="album-card">
                        <img src={Image} width={100} height={100} alt=""/>
                        <div>{playlist.musicListName}</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default ProfilePlaylistCard;

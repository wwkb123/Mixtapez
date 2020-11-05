import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import data from '../Mixtapez_data.json'

class PlaylistCard extends Component {

    render() {
        var playlistID = this.props.id;
        var link = "/playlist/"+playlistID;
        return (
            <div>
                <Link to={link}>
                    <div className="playlist-card">
                        <div>{data.PlayList[playlistID].trackName}</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default PlaylistCard;
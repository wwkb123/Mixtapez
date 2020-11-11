import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import data from '../Mixtapez_data.json'

class PlaylistCard extends Component {
    constructor(props){
        super(props);
    }
    render() {
        var playlistID = this.props.musicListId;
        var link = "/playlist/"+playlistID;
        return (
            <div>
                <Link to={link}>
                    <div className="playlist-card">
                        <div>{this.props.musicListName}</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default PlaylistCard;

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';
import data from '../Mixtapez_data.json'

class PlaylistsScreen extends Component {

    render() {
        var playlistIDs = data.users[0].tracks;
        return (
            <div>
                <br/><h1>All Playlists</h1>
                {playlistIDs.map(id => {
                    return (
                        <PlaylistCard id={id}/>
                    )})}
            </div>
        );
    }
}

export default PlaylistsScreen;

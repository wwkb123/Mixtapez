import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';

class PlaylistsScreen extends Component {

    render() {
        return (
            <div>
                <br/><h1>All Playlists</h1>
                <PlaylistCard/>
                <PlaylistCard/>
                <PlaylistCard/>
            </div>
        );
    }
}

export default PlaylistsScreen;

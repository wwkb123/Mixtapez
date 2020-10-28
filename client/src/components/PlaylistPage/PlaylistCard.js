import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';

class PlaylistCard extends Component {

    render() {
        return (
            <div>
                <Link to="/playlist/1">
                    <div className="playlist-card">
                        <div>New Playlist</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default PlaylistCard;

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';

class NavigationBar extends Component{
    render() {
        return(
            <div>
                <Link to="/"><Button className="nav-btn" size="lg">Home</Button></Link>
                <Link to="/search"><Button className="nav-btn" size="lg">Search</Button></Link>
                <Link to="/friends"><Button className="nav-btn" size="lg">Friends</Button></Link>
                <Link to="/playlists"><Button className="nav-btn" size="lg">Playlists</Button></Link>
                <Link to="/create"><Button className="nav-btn" size="lg">Create Playlist</Button></Link>
                <Link to="/liked"><Button className="nav-btn" size="lg">Liked Songs</Button></Link>
                <Link to="/signin"><Button className="nav-btn" size="lg">Sign In</Button></Link>
                <Link to="/signup"><Button className="nav-btn" size="lg">Sign Up</Button></Link>
            </div>

        );
    }
}
export default NavigationBar;

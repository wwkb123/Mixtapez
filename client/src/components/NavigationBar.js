import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'

class NavigationBar extends Component{
    render() {
        return(
            <div>
                <Button className="nav-btn" size="lg">Home</Button>
                <Button className="nav-btn" size="lg">Search</Button>
                <Button className="nav-btn" size="lg">Your Library</Button>
                
                <h3>Playlists</h3>
                <Button className="nav-btn" size="lg">Create Playlist</Button>
                <Button className="nav-btn" size="lg">Liked Songs</Button>
                <Button className="nav-btn" size="lg">Sign In</Button>
                <Button className="nav-btn" size="lg">Sign Up</Button>
            </div>

        );
    }
}
export default NavigationBar;

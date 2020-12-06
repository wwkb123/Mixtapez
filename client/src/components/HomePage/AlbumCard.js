import React, { Component } from 'react';
import Image from '../../tempData/AbbeyRoad.jpg'
import default_image from '../tempData/default_image.png'
import { Link } from 'react-router-dom';

class AlbumCard extends Component {

    render() {
        return (
            <div>
                <Link to="/playlist/1" style={{'color':'#ed4e85'}}>
                    <div className="album-card">
                        <img className="playlist-image" src={default_image} width={100} height={100} alt=""/>
                        <div>Album</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default AlbumCard;

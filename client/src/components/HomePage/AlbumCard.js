import React, { Component } from 'react';
import Image from '../../tempData/AbbeyRoad.jpg'
import { Link } from 'react-router-dom';

class AlbumCard extends Component {

    render() {
        return (
            <div>
                <Link to="/playlist/1" style={{'color':'#ed4e85'}}>
                    <div className="album-card">
                        <img src={Image} width={100} height={100} alt=""/>
                        <div>Album</div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default AlbumCard;

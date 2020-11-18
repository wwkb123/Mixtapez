import React, { Component, useEffect } from 'react';
import SongCard from "./SongCard.js";

class Test extends Component {
    render(){
        return(
            <SongCard song={this.props.song}></SongCard>
        );
    }
}
export default Test;
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';

class SearchScreen extends Component{
    render() {
        return(
            <div>
                <br/><h1>Search</h1>
                <h6>Type to search:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField size="small" placeholder="Song/Artist/Album" variant="outlined" />
                    <Button className="search-btn">Search</Button>
                </div>
                <br/><br/>
                <div className="border-bottom-accent"></div>
            </div>

        );
    }
}
export default SearchScreen;

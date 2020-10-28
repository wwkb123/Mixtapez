import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';
import { NativeSelect } from '@material-ui/core';

class SearchScreen extends Component{
    render() {
        return(
            <div>
                <br/><h1>Search</h1>
                <h6>Type to search:</h6>
                <div style={{"padding":"5px"}}>
                    <NativeSelect
                    defaultValue={"song"}
                    style={{"margin":"5px"}}
                    >
                        <option value={"song"}>Song</option>
                        <option value={"artist"}>Artist</option>
                        <option value={"album"}>Album</option>
                        <option value={"user"}>User</option>
                    </NativeSelect>
                    <TextField size="small" placeholder="search" variant="outlined" />
                    <Button className="search-btn">Search</Button>
                </div>
                <br/><br/>
                <div className="border-bottom-accent"></div>
            </div>

        );
    }
}
export default SearchScreen;

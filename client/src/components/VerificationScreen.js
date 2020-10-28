import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';

class VerificationScreen extends Component{
    render() {
        return(
            <div>
                <br/><h1>Verification</h1>
                <h6>Enter the 6-digit code sent to your email address:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField size="small" placeholder="6-digit code" variant="outlined" />
                </div>
                <Button className="search-btn">Verify</Button>
                <br/><br/>
                <div className="border-bottom-accent"></div>
            </div>

        );
    }
}
export default VerificationScreen;

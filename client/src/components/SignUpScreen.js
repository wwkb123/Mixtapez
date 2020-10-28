import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';

class SignUpScreen extends Component{
    render() {
        return(
            <div>
                <br/><h1>Sign Up</h1>
                <h6>Email Address:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField size="small" placeholder="email address" variant="outlined" />
                </div>
                <h6>Password:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField type="password" size="small" placeholder="password" variant="outlined" />
                </div>
                <h6>Confirm Password:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField type="password" size="small" placeholder="confirm password" variant="outlined" />
                </div>
                <br/>
                <Link to="/verification"><Button className="search-btn">Sign Up</Button></Link>
                <br/><br/>
                <div className="border-bottom-accent"></div>
            </div>

        );
    }
}
export default SignUpScreen;

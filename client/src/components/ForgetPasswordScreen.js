import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';

class ForgetPasswordScreen extends Component{
    render() {
        return(
            <div>
                <br/><h1>Forget Password</h1>
                <h6>Enter your email address:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField size="small" placeholder="email address" variant="outlined" />
                </div>
                <Link to="/verification"><Button className="search-btn">Submit</Button></Link>
                <br/><br/>
                <div className="border-bottom-accent"></div>
            </div>

        );
    }
}
export default ForgetPasswordScreen;

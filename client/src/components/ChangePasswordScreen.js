import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';

class ChangePasswordScreen extends Component{
    render() {
        return(
            <div>
                <br/><h1>Change Password</h1>
                <h6>Old Password:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField size="small" type="password" placeholder="old password" variant="outlined" />
                </div>
                <h6>New Password:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField type="password" size="small" placeholder="new password" variant="outlined" />
                </div>
                <h6>Confirm New Password:</h6>
                <div style={{"padding":"5px"}}>
                    <TextField type="password" size="small" placeholder="confirm new password" variant="outlined" />
                </div>
                <br/>
                <Link to="/"><Button className="search-btn">Submit</Button></Link>
                <br/><br/>
                <div className="border-bottom-accent"></div>
            </div>

        );
    }
}
export default ChangePasswordScreen;

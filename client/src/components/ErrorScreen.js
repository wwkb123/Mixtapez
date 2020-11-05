import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';



class ErrorScreen extends Component{
    
    render() {

        return(
            <div>Something is wrong. Please try again.</div>
        );
    }
}
export default ErrorScreen;

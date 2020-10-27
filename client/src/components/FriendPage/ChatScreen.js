import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { TextField } from '@material-ui/core';
import Button from 'react-bootstrap/Button'

class ChatScreen extends Component {

    render() {
        var userID = 0;
        return (
            <div>
                <Link to={'/profile/' + userID} key={userID}>
                    <FriendCard/>
                </Link>
                <div className="dialog-area">
                    <div className="friend-dialog">Hi How are you</div>
                    <div className="self-dialog">Good</div>
                    <div className="self-dialog">How are you</div>
                    <div className="friend-dialog">Good</div>
                </div>
                
                <div className="input-message">
                    <div style={{"verticalAlign":"middle","display":"table-cell"}}>Your Message: </div>
                    <TextField style={{"width":"90%"}} placeholder="Aa" variant="outlined" />
                    <div style={{"verticalAlign":"middle","display":"table-cell"}}>
                        <Button style={{"font-size":"16px"}} className="nav-btn">Send</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatScreen;

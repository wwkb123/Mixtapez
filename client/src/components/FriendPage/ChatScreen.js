import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendCard from './FriendCard.js'
import { TextField } from '@material-ui/core';
import Button from 'react-bootstrap/Button'
import UserAPI from "../../apis/UserAPI";
import io from "socket.io-client";


class ChatScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            friend: null,
            isFriend: false,
            conversation_id: "",
            messages: [],
            message_to_send: "",
            socket: null,
        }
    }

    handleChange = (e) => {
        const {target} = e;
    
        this.setState( (state) => ({
            ...state,
            [target.id]: target.value
    
        }));
    }

    loadFriend = async () => {
        var userID = localStorage.getItem('userId');  // self ID
        var friendID = this.props.match.params.id;
        let friends_IDs = []
        const response = await UserAPI.post("/user", {
            id: userID
        });
        if(response.data.status === "success"){
            friends_IDs = response.data.user.friends;
        }
        if(!friends_IDs.includes(friendID)){  // not user's friend
            return;
        }
       
        try{
            const response = await UserAPI.post("/user", {  // get friend's info
                id: friendID
            });
            if(response.data.status === "success"){
                this.setState({friend: response.data.user});
                this.setState({isFriend: true});
                const conversation_response = await UserAPI.post("/getConversation", {  // get friend's info
                    userID,
                    friendID
                });
                if(conversation_response.data.status === "success"){
                    var conversation_id = conversation_response.data.conv_id;
                    var messages = conversation_response.data.messages;
                    // console.log(conversation_id, messages);
                    this.setState({conversation_id}, () => {
                        this.connectToSocket();  // connect to socket after getting a conversation_id
                    });
                    this.setState({messages});
                    var dialog = document.getElementById('dialog');
                    if(dialog)
                        dialog.scrollTop = dialog.scrollHeight;
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    onSendClick = async () =>{
        var userID = localStorage.getItem('userId');
        var message = this.state.message_to_send;
        var conversation_id = this.state.conversation_id;
        if(message !== ""){
            message = userID+":"+message
            const response = await UserAPI.post("/sendMessage", {
                conversation_id,
                message
            });
            if(response.data.status === "success"){
                var messages = response.data.messages;
                this.setState({messages});
                this.setState({message_to_send:""})
                // emit chat event to socket
                if(this.state.socket){
                    this.state.socket.emit('chat', {
                        conversation_id
                    });
                }
            }
        }
        
    }

    connectToSocket = async () => {
        if(this.state.socket == null){
            // Make connection

            // var url = "https://guguwagwag.herokuapp.com";
            var url = "http://localhost:3001";
            const socket = io(url, {
                withCredentials: true,
                extraHeaders: {
                    "my-custom-header": "abcd"
                }
            });
            this.setState({socket}, ()=>{
                console.log(this.state.socket);
                // connect to room
                if(this.state.socket && this.state.conversation_id){
                    this.state.socket.emit('joinRoom', {
                        room: this.state.conversation_id
                    });
                }

                if(this.state.socket && this.state.conversation_id){  // listen to socket's chat event
                    this.state.socket.on('chat', async (data) => {
                        console.log('from socket:', data);
                        // query database to update messages
                        const response = await UserAPI.post("/getMessages", {
                            conversation_id: data
                        });
                        if(response.data.status === "success"){
                            var messages = response.data.messages;
                            this.setState({messages});
                            var dialog = document.getElementById('dialog');
                            if(dialog)
                                dialog.scrollTop = dialog.scrollHeight;
                        }
                    });
                }
            });
        }
    }

    componentDidMount() {
        this.loadFriend();
    }

    componentWillUnmount() {
        if(this.state.socket)
            this.state.socket.close();
    }

    render() {
        var friendID = ""
        var friend = ""
        if(this.state.friend){
            friendID = this.state.friend._id;
            friend = this.state.friend;
        }
        if(!this.state.isFriend){
            return <div>You can't chat with a person that is not your friend.</div>
        }
        var dialog_cards = ""
        if(this.state.messages){
            dialog_cards = this.state.messages.map((message, index) => {
                let message_author = message.substring(0, message.indexOf(":"));
                let message_content = message.substring(message.indexOf(":")+1, message.length);
                var friendID = this.props.match.params.id;
                var dialog_class = ""
                if(message_author===friendID){  // from friend
                    dialog_class = "friend-dialog"
                }else{
                    dialog_class = "self-dialog"
                }
                return (<div key={index}>
                    <div className={dialog_class}>{message_content}</div>
                </div>
                )
            })
        }
        return (
            <div>
                <Link to={'/profile/' + friendID} key={friendID}>
                    <FriendCard user={friend}/>
                </Link>
                <div className="dialog-area" id="dialog">
                    { dialog_cards }
                    {/* <div className="friend-dialog">Hi How are you</div>
                    <div className="self-dialog">Good</div>
                    <div className="self-dialog">How are you</div>
                    <div className="friend-dialog">Good</div> */}
                </div>
                
                <div className="input-message">
                    <div style={{"verticalAlign":"middle","display":"table-cell"}}>Your Message: </div>
                    <TextField value={this.state.message_to_send} id="message_to_send" onChange={this.handleChange} style={{"width":"90%"}} placeholder="Aa" variant="outlined" />
                    <div style={{"verticalAlign":"middle","display":"table-cell"}}>
                        <Button style={{"fontSize":"16px"}} onClick={this.onSendClick} className="nav-btn">Send</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatScreen;

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsPersonSquare } from "react-icons/bs";
import { IconContext } from "react-icons";
import UserAPI from '../../apis/UserAPI'
import { Link } from 'react-router-dom';

class FriendCard extends Component {
    constructor(){
        super()
        this.state = {
            now_playing: "none",
            now_playing_ID: ""
        }
    }
    componentDidMount() {
        if(this.props.user.nowListening !== "none"){
            this.updateNowPlaying(this.props.user.nowListening);
        }else{
            this.setState({now_playing: 'none'});
        }
        if(this.props.now_playing !== "none"){
            this.updateNowPlaying(this.props.now_playing);
        }else{
            this.setState({now_playing: 'none'});
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user.nowListening !== "none"){
            this.updateNowPlaying(nextProps.user.nowListening);
        }else{
            this.setState({now_playing: 'none'});
        }
        if(nextProps.now_playing !== "none"){
            this.updateNowPlaying(nextProps.now_playing);
        }else{
            this.setState({now_playing: 'none'});
        }
    }

    updateNowPlaying = async (now_playing_ID) => {
        if(now_playing_ID){
            const song_response = await UserAPI.get("/musicListRoute/music/"+now_playing_ID);
            if(song_response.data.status === "success"){ // search success
                this.setState({now_playing_ID});
                this.setState({now_playing: song_response.data.music.musicName});
            }else{
                console.log("error searching song");
            }
        }
        
    }
    render() {
        var username = ""
        var userID = ""
        var now_playing = this.state.now_playing;
        if(this.props.user){
            username = this.props.user.nickName;
            userID = this.props.user._id;
        }
        var user_icon = ""
        var container_style = {}
        var now_playing_card = ""
        if(this.state.now_playing){
            if(now_playing !== "none"){
                now_playing_card = <Link to={'/song/'+this.state.now_playing_ID}><h6>Last Playing: {now_playing}</h6></Link>
            }else{
                now_playing_card = <h6>Last Playing: {now_playing}</h6>
            }
            
        }
        if(this.props.isOffline){
            user_icon = <IconContext.Provider value={{ color: "#ACACAC", size: '50px' }}>
                <BsPersonSquare/>
            </IconContext.Provider>
            container_style = {'color':'#ACACAC'}
            now_playing_card = <h6 style={{'color':'#ACACAC'}}>Offline</h6>
        }else{
            user_icon = <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                <BsPersonSquare/>
            </IconContext.Provider>
            if(now_playing !== "none"){
                now_playing_card = <Link to={'/song/'+this.state.now_playing_ID}><h6>Last Playing: {now_playing}</h6></Link>
            }else{
                now_playing_card = <h6>Last Playing: {now_playing}</h6>
            }
        }
        
        return (
            <div className="m-3" style={container_style}>
                <Container>
                    <Row style={{'border': '3px solid', 'padding': '30px', 'borderRadius': '5px'}}>
                        <Col xs={3} className="content-center">
                            <br/>
                            { user_icon }
                        </Col>
                        <Col xs={9}>
                            <h4>{username}</h4>
                            <br/>
                            { now_playing_card }
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default FriendCard;

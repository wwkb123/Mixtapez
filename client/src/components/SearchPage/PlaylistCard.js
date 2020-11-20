import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import UserAPI from "../../apis/UserAPI";

class PlaylistCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            owner: ""
        }
    }

    getNickName = async (id) => {
        var owner = "";
        try {
            const response = await UserAPI.post("/user/nickName", {
                id: id
            });
            if(response.data.status == "success"){ // search success
                console.log("success");
                owner = response.data.nickName;
                this.setState({owner});
            }else{ // somehow failed
                
            }
        }catch (err) {
            console.log(err);
        }
    }
    
    componentDidMount() {
        var playlist = this.props.playlist;
        if(playlist){
            this.getNickName(playlist.owner);
        }
        
    }

    render() {
        var playlist = this.props.playlist;
        if(playlist){
            var owner = this.state.owner;
            return(
                <div>
                    <Link to={"/playlist/"+playlist._id} style={{'color':'#ed4e85'}}>
                        <Container>
                            <Row className="border-bottom-accent">
                                <Col xs={1}>
                                    &#9825;
                                </Col>
                                <Col xs={3}>
                                    {/* {data.music[id].musicName} */}
                                    { playlist.musicListName }
                                </Col>
                                <Col xs={3}>
                                    { owner }
                                </Col>
                            </Row>
                        </Container>
                    </Link>
                </div>
            );
        }else{
            return <div>error</div>
        }
    }
}
export default PlaylistCard;

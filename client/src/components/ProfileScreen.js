import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import AlbumCard from './HomePage/AlbumCard.js'
import FriendCard from './FriendPage/FriendCard.js'
import data from './Mixtapez_data.json'
import UserAPI from "../apis/UserAPI";

class ProfileScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null
        }
    }
    getUser = async (id) => {
        var user = "";
        console.log("looking for user", id);
        try {
            const response = await UserAPI.post("/user", {
                id: id
            });
            if(response.data.status == "success"){ // search success
                console.log("success");
                user = response.data.user;
                this.setState({user});
            }else{ // somehow failed
                
            }
        }catch (err) {
            console.log(err);
        }
    }
    
    componentDidMount() {
        var userID = this.props.match.params.id;
        if(userID !== ""){
            this.getUser(userID);
        }
        
    }

    render() {
        var userID = this.props.match.params.id;
        var user = this.state.user;
        if(user){
            return (
                <div>
                    <br/>
                    <h1>Profile</h1>
                    {/* <FriendCard name={data.users[userID].nickName}/> */}
                    <FriendCard name={user.nickName}/>
                    <Button className="search-btn bg-gray">Remove Friend</Button><br/><br/>
                    <Container>
                        <Row>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                            <Col xs={3}>
                                <AlbumCard/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }else{
            return <></>
        }
    }
}

export default ProfileScreen;

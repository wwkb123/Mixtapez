import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import Image from '../../tempData/AbbeyRoad.jpg'
import image2 from '../../tempData/album2.jpg'
import image3 from '../../tempData/album3.jpg'
import default_image from '../../tempData/default_image.png'
import ProfilePlaylistCard from '../ProfilePlaylistCard';
import UserAPI from '../../apis/UserAPI';

class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            publicPlaylists: []
        }
    }

    getPublicPlaylists = async () => {
        try{
            const playlists_response = await UserAPI.get("/musicListRoute/randomPlaylists");
            if(playlists_response.data.status === "success"){
                var publicPlaylists = playlists_response.data.playlists;
                this.setState({publicPlaylists: publicPlaylists});
            }
        }catch (err) {
            console.log(err);
        }
    }

    updateNavBar = () => {
        var navbtns = document.getElementsByClassName("nav-btn");
        if(navbtns){
            for(let i = 0; i < navbtns.length; i++){
                if(navbtns[i]){
                    if(navbtns[i].id === "home"){
                        navbtns[i].classList.add("curr-page");
                    }else{
                        navbtns[i].classList.remove("curr-page");
                    }
                }
            }
        }
    }

    componentDidMount() {
        this.getPublicPlaylists();
        this.updateNavBar();
    }

    render() {
        var playlist_cards = ""
        if(this.state.publicPlaylists){
            playlist_cards = this.state.publicPlaylists.map((playlist, index) => {
                return (<div key={index}>
                <ProfilePlaylistCard className="grid-item" playlist={playlist}></ProfilePlaylistCard>
                </div>
                )
            })
        }
        return (
            <div>
                <Carousel>
                    <Carousel.Item>
                        <div className="feature-album">
                            <img
                            className="d-block w-100"
                            src={image2}
                            alt="First slide"
                            
                            />
                        </div>
                        
                        <Carousel.Caption>
                        <h3>Mixtapez</h3>
                        <p>Enjoy music for free. No ads.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="feature-album">
                            <img
                            className="d-block w-100"
                            src={Image}
                            alt="Second slide"
                            />
                        </div>

                        <Carousel.Caption>
                        <h3>Become an artist</h3>
                        <p>Search songs. Make your own mixtapes.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="feature-album">
                            <img
                            className="d-block w-100"
                            src={image3}
                            alt="Third slide"
                            />
                        </div>
                        <Carousel.Caption>
                        <h3>Social</h3>
                        <p>Chat with friends. Interact with others.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    </Carousel>
                    <br/>
                    <h1>Recommended Playlists</h1>
                    <div className="border-bottom-accent"></div>
                    <div className="grid-container">
                        { playlist_cards }
                    </div>
            </div>
        );
    }
}

export default HomeScreen;

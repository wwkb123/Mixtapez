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
            const playlists_response = await UserAPI.get("/randomPlaylists");
            if(playlists_response.data.status === "success"){
                var publicPlaylists = playlists_response.data.playlists;
                // console.log(publicPlaylists);
                this.setState({publicPlaylists: publicPlaylists});
            }
        }catch (err) {
            console.log(err);
        }
    }

    componentDidMount() {
        this.getPublicPlaylists();
    }

    render() {
        var playlist_cards = ""
        if(this.state.publicPlaylists){
            playlist_cards = this.state.publicPlaylists.map((playlist, index) => {
                return (<ProfilePlaylistCard className="grid-item" playlist={playlist}></ProfilePlaylistCard>)
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
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
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
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    </Carousel>
                    <h1>Trending Playlists</h1>
                    <div className="border-bottom-accent"></div>
                    <div className="grid-container">
                        { playlist_cards }
                    </div>
            </div>
        );
    }
}

export default HomeScreen;

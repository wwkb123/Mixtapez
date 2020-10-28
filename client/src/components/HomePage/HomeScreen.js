import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import AlbumCard from './AlbumCard.js'
import Carousel from 'react-bootstrap/Carousel'
import Image from '../../tempData/AbbeyRoad.jpg'
import image2 from '../../tempData/album2.jpg'
import image3 from '../../tempData/album3.jpg'

class HomeScreen extends Component {

    render() {
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
    }
}

export default HomeScreen;

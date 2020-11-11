import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from '../../tempData/AbbeyRoad.jpg'
import { MdPauseCircleOutline, MdMoreHoriz} from "react-icons/md";
import {IoMdHeartEmpty} from "react-icons/io"
import { IconContext } from "react-icons";
import Button from 'react-bootstrap/Button'
import { Grid, Paper } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
/*
class playPauseButton extends Component {
    constructor(props) {
      super(props);
      this.state = {isToggleOn: true};
  
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      this.setState(state => ({
        isToggleOn: !state.isToggleOn
      }));
    }
  
    render() {
      return (
        <button onClick={this.handleClick} className={this.state.isToggleOn?"playButton":"pausedButton"}>
        </button>
      );
    }
  }*/


class DisplayPlaylistScreen extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <Container>
                    <Row>
                        <img src={Image} width={175} height={175} alt="">
                        </img>
                        <Col>
                            <Col xs={10} className="content-left">
                                <h3>Playlists</h3>
                                <h1 style={{fontWeight: "bold"}} >NEW Playlists</h1> {/*List name*/}
                            </Col>
                            <Col xs={10} className="content-center">
                                <h5>Artirst</h5>Artirst                    
                                <h3 style={{fontWeight: "bold"}} >Mixtapez|0 Song|0 second</h3> {/*List name*/}
                            </Col>
                        </Col>
                    </Row>
                    <Row xs={10}>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '50px' }}>
                            <MdPauseCircleOutline/>
                            <AiOutlinePlusCircle/>
                            <MdMoreHoriz/>
                        </IconContext.Provider>
                    </Row>
                    <Col xs={10} className="content-center">
                        <Grid container spacing={0}>
                            <Grid item xs ={1}>
                                <div className='music-in-list-info'>1</div>
                            </Grid>
                            <Grid item xs ={5}>
                                <div className='music-in-list-info'>Come Together</div>
                            </Grid>
                            <Grid item xs ={2}>
                                <div className='music-in-list-info'>The Beatles</div>
                            </Grid>
                            <Grid item xs ={2}>
                                <div className='music-in-list-info'>4:18</div>
                            </Grid>
                            <Grid item xs ={1}>
                                <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                                    <MdMoreHoriz/>
                                </IconContext.Provider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0}>
                            <Grid item xs ={1}>
                                <div className='music-in-list-info'>2</div>
                            </Grid>
                            <Grid item xs ={5}>
                                <div className='music-in-list-info'>Come Together</div>
                            </Grid>
                            <Grid item xs ={2}>
                                <div className='music-in-list-info'>The Beatles</div>
                            </Grid>
                            <Grid item xs ={2}>
                                <div className='music-in-list-info'>4:18</div>
                            </Grid>
                            <Grid item xs ={1}>
                                <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                                    <MdMoreHoriz/>
                                </IconContext.Provider>
                            </Grid>
                        </Grid>
                    </Col>
                </Container>
            </div>
        )
    };

}

export default DisplayPlaylistScreen;
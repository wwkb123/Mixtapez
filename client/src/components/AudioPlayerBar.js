import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { IconContext } from "react-icons";
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdPlaylistPlay,
    MdShuffle, MdRepeat, MdVolumeUp
} from "react-icons/md";
import Slider from '@material-ui/core/Slider';
import { Link } from 'react-router-dom';

class AudioPlayerBar extends Component {
    render() {
        return (
            <div className="secondary-bg" style={{'height':'20vh', 'zIndex':'10', 'color':'#ed4e85'}}>
                <Container>
                    <Row>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '40px' }}>
                            <Col xs={2} className="content-center">
                                <Link to="/queue" style={{'color':'#ed4e85'}}><MdPlaylistPlay />Queue</Link>
                            </Col>
                            <Col xs={2} className="content-center">
                                <div>Song Name</div>
                            </Col>
                            
                            <Col xs={4} className="content-center">
                                <MdSkipPrevious />
                                <MdPlayArrow />
                                <MdSkipNext />
                            </Col>
                            <Col xs={4} className="content-center">
                                <MdShuffle/>
                                <MdRepeat/>
                                <MdVolumeUp/>
                                <Slider className="volume-slider" aria-labelledby="continuous-slider" />
                            </Col>
                        </IconContext.Provider>
                    </Row>
                        
                    <Row>
                        <Col className="content-center">
                        <span style={{"margin":"10px"}}>00:00</span>
                        <Slider className="audio-slider" aria-labelledby="continuous-slider" />
                        <span style={{"margin":"10px"}}>04:00</span>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default AudioPlayerBar;

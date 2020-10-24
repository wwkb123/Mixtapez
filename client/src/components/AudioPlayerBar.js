import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { IconContext } from "react-icons";
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdPlaylistPlay,
    MdShuffle, MdRepeat, MdVolumeUp
} from "react-icons/md";
import Slider from '@material-ui/core/Slider';

class AudioPlayerBar extends Component {
    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '40px' }}>
                            <Col xs={4} className="content-center">
                                <MdPlaylistPlay />
                                <span>Song Name</span>
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
                        <Slider className="audio-slider" aria-labelledby="continuous-slider" />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default AudioPlayerBar;

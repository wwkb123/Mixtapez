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
import ReactAudioPlayer from 'react-audio-player';
import IconButton from '@material-ui/core/IconButton';

class AudioPlayerBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            isPlaying: false
        }
    }

    onPlayClick = () => {
        var audio = document.getElementById('audio');
        if(audio){
            if(!this.state.isPlaying){
                audio.play();
                this.setState({isPlaying: !this.state.isPlaying})
            }else{
                audio.pause();
                this.setState({isPlaying: !this.state.isPlaying})
            }
                
        }
    }

    render() {
        var play_pause_icon = <MdPlayArrow />
        if(this.state.isPlaying){
            play_pause_icon = <MdPause />
        }
        var path_to_queue = ""
        if(localStorage.getItem('isSignedIn')){
            path_to_queue = {pathname: "/queue"}
        }else{
            path_to_queue = "";
        }
        return (
            <div className="secondary-bg" style={{'height':'20vh', 'zIndex':'10', 'color':'#ed4e85'}}>
                <Container>
                <audio
                    id="audio"
                    src="https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb8817b6f2d041f15eb1?cid=774b29d4f13844c495f206cafdad9c86"
                />
                    <Row>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '40px' }}>
                            <Col xs={2} className="content-center">
                                <Link
                                to={path_to_queue}
                                
                                style={{'color':'#ed4e85'}}><MdPlaylistPlay />Queue</Link>
                            </Col>
                            <Col xs={2} className="content-center">
                                <div>Song Name</div>
                            </Col>
                            
                            <Col xs={4} className="content-center">
                                <MdSkipPrevious />
                                <IconButton
                                aria-label="play"
                                onClick={this.onPlayClick}
                            >
                                { play_pause_icon }
                            </IconButton>
                                
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

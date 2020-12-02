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
import UserAPI from "../apis/UserAPI";

class AudioPlayerBar extends Component {
    constructor(props){
        super(props);
        this.state={
            volume: 100,
            track_url: "",
            track_data: null,
            progress: 0,
            duration: 0,
            playing: false,
            audioTag: new Audio()
        };
    }

    tick = () =>{
        if(!this.state.playing){
            return;
        }
        this.setState({
            progress: this.state.audioTag.currentTime * 1000
        });
    }

    clickPlay = async () =>{
        console.log("clicked play")
        let queue = localStorage.getItem('queue');
        queue = JSON.parse(queue);
        console.log("queue:"+queue)
        if(queue.length > 0){
            let URI = queue[0]? queue[0].URI : null;
            console.log("URI:"+URI)
            const getSong_response = await UserAPI.post("/getSongAudio", {
                URI});
            if (getSong_response.data.status == "success") {
                console.log("successful load the track information")
                console.log("track url:"+getSong_response.data.track.preview_url)
                if (getSong_response.data.track.preview_url) {
                    this.setState({
                        url: getSong_response.data.track.preview_url,
                        track_data: getSong_response.data.track,
                        playing: true
                    });
                    this.state.audioTag.src = getSong_response.data.track.preview_url;
                    this.state.audioTag.play();
                }else{
                    console.log("no sample music aviliable")
                }
                
            }else{
                console.log("errored")
            }
        }
        

    }
    
    render() {
        var path_to_queue = ""
        if(localStorage.getItem('isSignedIn')){
            path_to_queue = {pathname: "/queue"}
        }else{
            path_to_queue = "";
        }
        return (
            <div className="secondary-bg" style={{'height':'20vh', 'zIndex':'10', 'color':'#ed4e85'}}>
                <Container>
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
                                <MdPlayArrow onClick={this.clickPlay} />
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

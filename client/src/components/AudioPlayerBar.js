import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { IconContext } from "react-icons";
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdPlaylistPlay,
    MdShuffle, MdRepeat, MdVolumeUp, MdVolumeOff, MdTagFaces
} from "react-icons/md";
import Slider from '@material-ui/core/Slider';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import UserAPI from "../apis/UserAPI";
import default_song from '../tempData/default.mp3'

class AudioPlayerBar extends Component {
    constructor(props){
        super(props);
        this.state={
            volume: 20,
            track_url: "",
            track_data: null,
            progress: 0,
            duration: 0,
            isPlaying: false,
            audioTag: new Audio(),
            isMute: false,
            isLoop: false,
            isShuffle: false,
            currentIndex: 0,
            interval: null
        };


        this.state.audioTag.addEventListener('ended', (event) => {  // when the music ends
            this.onNextSong();
        });

        this.changeVolumn(20);  // default volume
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    tick = () =>{
        if(!this.state.isPlaying){
            return;
        }
        this.setState({
            progress: this.state.audioTag.currentTime
        });
    }

    onNextSong = async () => {
        let queue = localStorage.getItem('queue');
        queue = JSON.parse(queue);
        if(!queue) return;
        this.state.audioTag.pause();
        if (this.state.track_data) {
            let index = 0;
            let found = false;
            for (index = 0; index < queue.length; index++) {
                if (queue[index].URI === this.state.track_data.id){
                    found = true;
                    break;
                }
            }
            if(!found){
                index = 0;  // not found, start from first song
            }else{
                if (this.state.isShuffle) {
                    index = Math.floor(Math.random()* queue.length)
                } else if (index === (queue.length - 1)){
                    index = 0;
                } else{
                    index = index + 1
                }
            }
            
            if (index < queue.length) {
                let song = queue[index];
                this.loadSongAndplay(song, index);
            }
        } else {
            this.onPlayClick();
        }
        
    }

    onPrevSong = async () => {
        
        let index = this.state.currentIndex;
        let queue = localStorage.getItem('queue');
        queue = JSON.parse(queue);
        if(!queue) return;
        if (this.state.track_data) {
            let index = 0;
            for (index = 0; index < queue.length; index++) {
                if (queue[index].URI === this.state.track_data.id){
                    break;
                }
            }
            if (index != 0){
                index = index - 1;
                let song = queue[index];
                this.loadSongAndplay(song, index);
            }
        } else {
            this.onPlayClick();
        }
    }

    loadQueueIndexAndPlay = (index) => {
        let queue = localStorage.getItem('queue');
        queue = JSON.parse(queue);
        if(!queue) return;
        if(index >= queue.length) return;
        this.loadSongAndplay(queue[index], index);
    }

    loadSongAndplay = async (song, index) =>{
        var id = localStorage.getItem('userId');
        if(!song){
            return;
        }
        var URI = song.URI;
        const getSong_response = await UserAPI.post("/musicListRoute/getSongAudio", {
            URI});
        if (getSong_response.data.status === "success") {
            if(id){
                const updateNowPlaying_response = await UserAPI.post("/musicListRoute/updateNowPlaying", {
                    id: id,
                    musicID: song._id
                });
                if(updateNowPlaying_response.data.status === "success") {
                    var updateNowPlaying = this.props.updateNowPlaying;
                    updateNowPlaying(updateNowPlaying_response.data.user.nowListening);
                }
            }
            
            if (getSong_response.data.track.preview_url) {
                let interval = this.state.interval;
                if(!interval){
                    interval = setInterval(this.tick, 100);
                }
                this.setState({
                    url: getSong_response.data.track.preview_url,
                    track_data: getSong_response.data.track,
                    isPlaying: true,
                    progress: 0,
                    currentIndex: index,
                    interval: interval
                });
                this.state.audioTag.src = getSong_response.data.track.preview_url;
                this.state.audioTag.play();
            }else{
                let interval = this.state.interval;
                if(!interval){
                    interval = setInterval(this.tick, 100);
                }
                this.setState({
                    track_data: getSong_response.data.track,
                    isPlaying: true,
                    progress: 0,
                    currentIndex: index,
                    interval: interval
                });
                this.state.audioTag.src = default_song;
                this.state.audioTag.play();
                var toast = document.getElementById("no_song_toast");
                toast.className = "show"; // show the toast
                // After 3 seconds, remove the show class from toast
                setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
            }
            
        }else{
            console.log("errored")
        } 
    }

    changeVolumn = (value) => {
        if(this.state.audioTag){
            this.state.audioTag.volume = value / 100;
            this.setState({volume: value});
        }
    }

    handleChange = (e, newValue) => {
        
        if(this.state.audioTag){
            this.state.audioTag.volume = newValue / 100;
            this.setState({volume: newValue});
        }
    }

    handleAudioSlider = (e, newValue) => {
        if (this.state.audioTag) {
            this.state.audioTag.currentTime = newValue/100 * 30;
            this.setState({progress: newValue/100 * 30});
        }
    }

    onPlayClick = async () =>{
        let queue = localStorage.getItem('queue');
        queue = JSON.parse(queue);
        if(!queue) return;
        if(this.state.track_data){
            if(this.state.audioTag){
                if(!this.state.isPlaying){
                    this.state.audioTag.play();
                    this.setState({
                        interval: setInterval(this.tick, 100),
                        isPlaying: !this.state.isPlaying})
                }else{
                    this.state.audioTag.pause();
                    clearInterval(this.state.interval);
                    this.setState({isPlaying: !this.state.isPlaying,
                    interval: null})
                }
            }
        }else{
            if(queue.length > 0){
                this.loadSongAndplay(queue[0], 0);
            }
        }
    }
    
    onVolumeClick = () => {
        if(this.state.audioTag){
            if(!this.state.isMute){
                this.state.audioTag.muted = true;
                this.setState({isMute: !this.state.isMute})
            }else{
                this.state.audioTag.muted = false;
                this.setState({isMute: !this.state.isMute})
            }
        }
    }

    onShuffleClick = () => {
        if(this.state.audioTag){
            if(!this.state.isShuffle){
                this.setState({isShuffle: !this.state.isShuffle})
                this.setState({isLoop: false})  // force turn off loop
            }else{
                this.setState({isShuffle: !this.state.isShuffle})
            }
        }
    }

    onLoopClick = () => {
        if(this.state.audioTag){
            if(!this.state.isLoop){
                this.state.audioTag.loop = true;
                this.setState({isLoop: !this.state.isLoop})
                this.setState({isShuffle: false})  // force turn off shuffle
            }else{
                this.state.audioTag.muted = false;
                this.state.audioTag.loop = false;
                this.setState({isLoop: !this.state.isLoop})
            }
        }
    }

    checkSignIn = () => {
        if(!localStorage.getItem('isSignedIn')){
            alert("Please sign in to use this function.");
        }
    }

    render() {
        var play_pause_icon = <MdPlayArrow />
        if(this.state.isPlaying){
            play_pause_icon = <MdPause />
        }
        var volume_icon = <MdVolumeUp/>
        if(this.state.isMute){
            volume_icon = <MdVolumeOff/>
        }

        var shuffle_icon = 
        <IconContext.Provider value={{ color: "#ADADAD", size: '40px'}}>
            <MdShuffle/>
        </IconContext.Provider>
        if(this.state.isShuffle){
            shuffle_icon = 
            <IconContext.Provider value={{ color: "#F06E9C", size: '40px'}}>
                <MdShuffle/>
            </IconContext.Provider>
        }
        var loop_icon = 
        <IconContext.Provider value={{ color: "#ADADAD", size: '40px'}}>
            <MdRepeat/>
        </IconContext.Provider>
        if(this.state.isLoop){
            loop_icon = 
            <IconContext.Provider value={{ color: "#F06E9C", size: '40px'}}>
                <MdRepeat/>
            </IconContext.Provider>
        }
       
        var path_to_queue = ""
        if(localStorage.getItem('isSignedIn')){
            path_to_queue = {pathname: "/queue"}
        }else{
            path_to_queue = "";
        }
        let progress = (this.state.progress/60<10?"0":"")+Math.floor(this.state.progress/60)+":"+(this.state.progress%60<10?"0":"")+Math.floor(this.state.progress%60);
        return (
            <div className="secondary-bg" style={{'height':'20vh', 'zIndex':'10', 'color':'#ed4e85'}}>
                <Container>
                    <Row>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '40px' }}>
                            <Col xs={2} className="content-center">
                                <Link
                                to={path_to_queue}
                                onClick={this.checkSignIn}
                                style={{'color':'#ed4e85'}}><MdPlaylistPlay />Queue</Link>
                            </Col>
                            <Col xs={2} className="content-center">
                                <div>{this.state.track_data?this.state.track_data.name:"none"}</div>
                            </Col>
                            
                            <Col xs={4} className="content-center">
                                <IconButton
                                    aria-label="prev"
                                    onClick={this.onPrevSong}
                                >
                                    <MdSkipPrevious  />
                                </IconButton>
                                
                                <IconButton
                                    aria-label="play"
                                    onClick={this.onPlayClick}
                                >
                                    { play_pause_icon }
                                </IconButton>
                                
                                <IconButton
                                    aria-label="next"
                                    onClick={this.onNextSong}
                                >
                                    <MdSkipNext />
                                </IconButton>
                                

                            </Col>
                            <Col xs={4} className="content-center">
                                <IconButton
                                    aria-label="shuffle"
                                    onClick={this.onShuffleClick}
                                >
                                    { shuffle_icon }
                                </IconButton>

                                <IconButton
                                    aria-label="loop"
                                    onClick={this.onLoopClick}
                                >
                                    { loop_icon }
                                </IconButton>

                                <IconButton
                                    aria-label="volume"
                                    onClick={this.onVolumeClick}
                                >
                                    { volume_icon }
                                </IconButton>
                                <Slider id="volume" value={this.state.volume} onChange={this.handleChange} className="volume-slider" aria-labelledby="continuous-slider" />
                            </Col>
                        </IconContext.Provider>
                    </Row>
                        
                    <Row>
                        <Col className="content-center">
                        <span style={{"margin":"10px"}}>{progress}</span>
                        <Slider className="audio-slider" aria-labelledby="continuous-slider" value={this.state.progress/30*100} onChange={this.handleAudioSlider} />
                        <span style={{"margin":"10px"}}>00:30</span>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default AudioPlayerBar;

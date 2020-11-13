import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { IconContext } from "react-icons";
import { MdMoreHoriz} from "react-icons/md";
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import Button from 'react-bootstrap/Button'

const GET_MUSIC_DETAIL = gql`
    query music($musicId: String) {
        music(id: $musicId) {
            musicName
            artist
        }
    }
`;
class MusicCard extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let itr = this.makeRangeIterator();
        let listblock = this.props.musics.map(musicId => <Query query={GET_MUSIC_DETAIL} variables={{musicId: musicId}}>
            {({loading, error, data}) =>{
                if (loading) return 'Loading...';
                if (error) return `Error! ${error.message}`;
                console.log(data);
                return(
                    <Grid container spacing={0}>
                        <Grid item xs ={1}>
                            <div className='music-list-header'>{itr.next()}</div>
                        </Grid>
                        <Grid item xs ={5}>
                            <div className='music-list-header'>{data.music.musicName} </div>
                        </Grid>
                        <Grid item xs ={2}>
                            <div className='music-list-header'>{data.music.artist}</div>
                        </Grid>
                        <Grid item xs ={2}>
                            <div className='music-list-header'>Length</div>
                        </Grid>
                        <Grid item xs ={1}>
                            <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                                <MdMoreHoriz/>
                            </IconContext.Provider>
                        </Grid>
                    </Grid> 
                )
            }}
        </Query>);
        if(this.props.musics.length == 0){
            listblock = <div>
                <Link to='/search'>
                    <Button className='nav-btn'>This list is empty, find more songs</Button>
                </Link>
            </div>
        }
        return (
            <Col xs={10} className="content-center">
                <Grid container spacing={0}>
                    <Grid item xs ={1}>
                        <div className='music-list-header'>Number</div>
                    </Grid>
                    <Grid item xs ={5}>
                        <div className='music-list-header'>Music</div>
                    </Grid>
                    <Grid item xs ={2}>
                        <div className='music-list-header'>Artist</div>
                    </Grid>
                    <Grid item xs ={2}>
                        <div className='music-list-header'>Length</div>
                    </Grid>
                    <Grid item xs ={1}>
                        <IconContext.Provider value={{ color: "#F06E9C", size: '30px' }}>
                            <MdMoreHoriz/>
                        </IconContext.Provider>
                    </Grid>
                </Grid>
                {listblock}
            </Col>
        );
    }

    makeRangeIterator = (start = 0, end = Infinity, step = 1) => {
        let nextIndex = start;
        let iterationCount = 0;
    
        const rangeIterator = {
           next: function() {
               let result;
               if (nextIndex < end) {
                   result = { value: nextIndex, done: false }
                   nextIndex += step;
                   iterationCount++;
                   return result;
               }
               return { value: iterationCount, done: true }
           }
        };
        return rangeIterator;
    }
}

export default MusicCard;
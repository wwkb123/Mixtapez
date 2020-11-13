import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';
import gql from 'graphql-tag'
import {Query} from 'react-apollo'

const GET_PLAYLIST = gql`
    query user($userId: String) {
        user(id: $userId) {
            musicLists{
                _id
            }
        }
    }
`;

const GET_LIST_DETAIL = gql`
    query musicList($musicListId: String) {
        musicList(id: $musicListId) {
            musicListName
            owner{
                _id
            }
        }
    }
`;

class PlaylistsScreen extends Component {
    constructor(props){
        super(props)
    }
    render() {
        if(!this.props.userId){
            this.props.history.push('/signin');
        }
        return (
            <div>
                <br/><h1>All Playlists</h1>
                <Query pollInterval={1000} query={GET_PLAYLIST} variables={{userId: this.props.userId}}>
                    {({loading, error, data}) => 
                    {
                        
                        if (loading) return 'Loading...';
                        if (error) return `Error! ${error.message}`;
                        
                        //console.log(data.user);
                        //console.log(data.user.musicLists);
                        // data.user.musicLists.map( musiclist => console.log(musiclist._id));
                        return(<div>
                            {
                            data.user.musicLists.map( (musicList) => 
                                    (<Query pollInterval={1000} query={GET_LIST_DETAIL} variables={{musicListId: musicList._id}}
                                    key={musicList}>
                                    {({loading, error, data}) =>{
                                        if (loading) return 'Loading...';
                                        if (error) return `Error! ${error.message}`;
                                        //console.log(data.musicList.owner);
                                        //return(<div></div>)
                                        if(data.musicList && data.musicList.owner){
                                            return(
                                                <PlaylistCard
                                                userId={this.props.userId}
                                                musicListId={musicList._id}
                                                musicListName={data.musicList.musicListName}
                                                ownerId={data.musicList.owner._id}/>
                                            )
                                        }else{
                                            return <></>
                                        }
                                        
                                    }                                   
                                    }
                                    </Query>)
                            )}
                        </div>)
                    }
                        // {
                        //     console.log(data.musicLists);
                        //     if (loading) return 'Loading...';
                        //     if (error) return `Error! ${error.message}`;
                        //     return(<div>
                        //         {/* {data.musicLists.map( (musicList) => 
                        //             (<Query pollInterval={500} query={GET_LIST_DETAIL} variables={{musicListId: musicList.id}}>
                        //             {({loading, error, data}) =>{
                        //                 if (loading) return 'Loading...';
                        //                 if (error) return `Error! ${error.message}`;
                        //                 return(<PlaylistCard
                        //                     musicListId={musicList.id}
                        //                     musicListName={data.musicList.musicListName}
                        //                 />)
                        //             }                                   
                        //             }
                        //             </Query>)
                        //         )} */}
                        //     </div>
                        //     )
                        // }
                    }
                </Query>
            </div>
        );
    }
}

export default PlaylistsScreen;

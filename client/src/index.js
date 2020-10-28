import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import './App.css';
// THESE ARE OUR REACT SCREENS, WHICH WE WILL ROUTE HERE
import HomeScreen from './components/HomePage/HomeScreen';
import FriendScreen from './components/FriendPage/FriendScreen'
import ChatScreen from './components/FriendPage/ChatScreen';
import PlaylistsScreen from './components/PlaylistsScreen'
import NavigationBar from './components/NavigationBar.js'
import AudioPlayerBar from './components/AudioPlayerBar.js';
import CreateNewList from './components/CreateNewList.js'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DisplayPlaylistScreen from './components/DisplayPlaylist';

const client = new ApolloClient({ uri: 'http://localhost:3000/graphql' });

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router>
            <div className="primary-bg" style={{"borderTop":"15px solid #F6D8FC"}}>
                <Container>
                    <Row>
                        <Col xs={3}>
                            <NavigationBar/>
                        </Col>
                        <Col xs={9} className="white-bg">
                            <Switch>
                                <Route exact path='/' component={HomeScreen} />
                                <Route path='/friends' component={FriendScreen} />
                                <Route path='/chat/:id' component={ChatScreen} />
                                <Route path='/profile/:id' component={ChatScreen} />
                                <Route path='/create' component={CreateNewList} />
                                <Route path='/playlists' component={PlaylistsScreen} />
                                <Route path='/playlist/:id' component={DisplayPlaylistScreen} />
                                {/* <Route path='/edit/:id' component={EditLogoScreen} />
                                <Route path='/create' component={CreateLogoScreen} />
                                <Route path='/view/:id' component={ViewLogoScreen} /> */}
                            </Switch>
                        </Col>
                    </Row>
                </Container>
                <AudioPlayerBar/>
            </div>
        </Router>
    </ApolloProvider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://create-react-app.dev/docs/making-a-progressive-web-app/
serviceWorker.unregister();

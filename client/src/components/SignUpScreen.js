import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';

import gql from "graphql-tag";
import { Mutation } from "react-apollo";
const ADD_USER = gql`
    mutation AddUser(
        $userName: String!,
        $password: String!,
        $nickName: String!
        ) {
        addUser(
            userName: $userName,
            password: $password,
            nickName: $nickName
            ) {
            _id
        }
    }
`;



class SignUpScreen extends Component{
    constructor(){
        super();
        this.state = {
            email: "",
            password: "",
            passwordConfirm: ""
        }
    }
    
    handleChange = (e) => {
        const {target} = e;
    
        this.setState( (state) => ({
            ...state,
            [target.id]: target.value
    
        }));
    }
    render() {
        return(
            <Mutation  mutation={ADD_USER} onCompleted={() => this.props.history.push('/verification')}>
                {(addUser,{loading, error}) => (
                    <div>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(this.state.password === this.state.passwordConfirm){
                                addUser({
                                    variables: {
                                        userName: this.state.email,
                                        password: this.state.password,
                                        nickName: "New User"
                                    }
                                })
                            }else{
                                alert("Password do not match");
                            }
                           
                            }
                        }>
                        <br/><h1>Sign Up</h1>
                        <h6>Email Address:</h6>
                        <div style={{"padding":"5px"}}>
                            <TextField size="small" placeholder="email address" variant="outlined" id="email"
                             onChange={this.handleChange} />
                        </div>
                        <h6>Password:</h6>
                        <div style={{"padding":"5px"}}>
                            <TextField type="password" size="small" placeholder="password" variant="outlined" 
                            id = "password" onChange={this.handleChange}/>
                        </div>
                        <h6>Confirm Password:</h6>
                        <div style={{"padding":"5px"}}>
                            <TextField type="password" size="small" placeholder="confirm password" variant="outlined" 
                            id = "passwordConfirm" onChange={this.handleChange}/>
                        </div>
                        <br/>
                        {/* <Link to="/verification"> */}
                            <Button type="submit" className="search-btn">Sign Up</Button>
                        {/* </Link> */}
                        <br/><br/>
                        <div className="border-bottom-accent"></div>
                        </form>
                    </div>
                )}
                
            </Mutation>

        );
    }
}
export default SignUpScreen;

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';

import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { useQuery } from '@apollo/client';
import UserAPI from "../apis/UserAPI";

const ADD_USER = gql`
    mutation AddUser(
        $userName: String!,
        $password: String!,
        $nickName: String!,
        $verified: Boolean!
        ) {
        addUser(
            userName: $userName,
            password: $password,
            nickName: $nickName,
            verified: $verified
            ) {
            _id
        }
    }
`;

const GET_USER = gql`
    query userByUserName($userName: String!) {
        userByUserName(userName: $userName) {
            _id
            userName
        }
    }
`;



class SignUpScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            nickName: "New User",
            password: "",
            passwordConfirm: "",
            status: ""
        }
    }
    
    handleChange = (e) => {
        const {target} = e;
    
        this.setState( (state) => ({
            ...state,
            [target.id]: target.value
    
        }));
    }

    onCompleted = () => {
        
    //     fetch("test", 
    //     {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json',
    //         }
    //       , body: JSON.stringify(email)})
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data)
    //     // this.props.history.push('/emailsent');
    //   })
    //   .catch(err => console.log(err))
        // if(this.state.status == "success"){
            
        // }
        // else{
        //     
        // }
        
    }

    onSubmit = async (e, addUser) => {
        e.preventDefault();
        var email = this.state.email;
        // todo: check email format
        console.log(email);
        if(this.state.email !== "" && this.state.nickName && this.state.password !== "" && this.state.passwordConfirm !== ""){
            if(this.state.password === this.state.passwordConfirm){
                // check email exists
                try {
                    const register_response = await UserAPI.post("/register", {
                        email
                    });
                    if(register_response.data.status == "success"){  // email can be used
                        await addUser({
                            variables: {
                                userName: this.state.email,
                                password: this.state.password,
                                nickName: this.state.nickName,
                                verified: false
                            }
                        })
                        const sendEmail_response = await UserAPI.post("/sendVerifyEmail", {
                            email
                        });
                        if(sendEmail_response.data.status == "success"){
                            console.log("success");
                            // this.props.signedIn("NewUser");
                            this.props.history.push('/emailsent');
                        }else{
                            this.props.history.push('/error');
                        }
                        // if(sendEmail_response){
                        //     this.setState({status: sendEmail_response.data.status});
                        // }
                        
                    }else{
                        alert("This email has been registered.");
                    }
                    
                    
                } catch (err) {
                    console.log(err);
                }
                
            }else{
                alert("Password do not match");
            }
        }else{
            alert("All fields must be filled");
        }
        
    
    }
    render() {

        return(
            <Mutation  mutation={ADD_USER} onCompleted={this.onCompleted}>
                {(addUser,{loading, error}) => (
                    <div>
                        <form onSubmit={(e) => this.onSubmit(e, addUser)}>
                        <br/><h1>Sign Up</h1>
                        <h6>Email Address:</h6>
                        <div style={{"padding":"5px"}}>
                            <TextField size="small" placeholder="email address" variant="outlined" id="email"
                             onChange={this.handleChange} />
                        </div>
                        <h6>Nickname:</h6>
                        <div style={{"padding":"5px"}}>
                            <TextField size="small" placeholder="nickname" variant="outlined" id="nickName"
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

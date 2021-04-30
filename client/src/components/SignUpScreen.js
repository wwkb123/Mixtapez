import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { TextField } from '@material-ui/core';

import gql from "graphql-tag";
import { Mutation } from "react-apollo";
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

    updateNavBar = () => {
        var navbtns = document.getElementsByClassName("nav-btn");
        if(navbtns){
            for(let i = 0; i < navbtns.length; i++){
                if(navbtns[i]){
                    if(navbtns[i].id === "signup"){
                        navbtns[i].classList.add("curr-page");
                    }else{
                        navbtns[i].classList.remove("curr-page");
                    }
                }
            }
        }
    }

    componentDidMount() {
        this.updateNavBar();
    }

    onCompleted = () => {
        
    }

    onSubmit = async (e, addUser) => {
        e.preventDefault();
        var email = this.state.email;
        var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        var validate_result = regex.test(email);
        if(validate_result === false){
            alert("Please enter an email address with correct format.");
            return;
        }
        console.log(email);
        if(this.state.email !== "" && this.state.nickName && this.state.password !== "" && this.state.passwordConfirm !== ""){
            if(this.state.password === this.state.passwordConfirm){
                // check email exists
                try {
                    const register_response = await UserAPI.post("/users/register", {
                        email
                    });
                    if(register_response.data.status === "success"){  // email can be used
                        const hashPassword_response = await UserAPI.post("/users/hashPassword", {
                            password: this.state.password
                        });
                        if(hashPassword_response.data.status === "success"){  // got hashed password
                            var toast = document.getElementById("loading_toast");
                            toast.className = "show"; // show the toast
                            // After 3 seconds, remove the show class from toast
                            setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
                            await addUser({
                                variables: {
                                    userName: this.state.email,
                                    password: hashPassword_response.data.hashedPassword,
                                    nickName: this.state.nickName,
                                    verified: false
                                }
                            })
                            const sendEmail_response = await UserAPI.post("/users/sendVerifyEmail", {
                                email
                            });
                            if(sendEmail_response.data.status === "success"){
                                console.log("success");
                                this.props.history.push('/emailsent');
                            }else{
                                this.props.history.push('/error');
                            }
                        }else{  // something wrong with hashing
                            this.props.history.push('/error');
                        }
                        
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
                            <Button type="submit" className="search-btn">Sign Up</Button>
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

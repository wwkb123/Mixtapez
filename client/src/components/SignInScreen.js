import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import UserAPI from "../apis/UserAPI";

class SignInScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
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

    onSubmit = async (e) => {
        e.preventDefault();
        var email = this.state.email;
        var password = this.state.password;
        if(email !== "" && password !== ""){
            try {
                const response = await UserAPI.post("/signin", {
                    email,
                    password
                });
                if(response.data.status == "success"){
                    console.log("success");
                    this.props.signedIn(response.data.nickName, response.data.userId);
                    this.props.history.push('/');
                }else if(response.data.status == "failed"){
                    alert("Wrong credentials. Please try again.");
                }else if(response.data.status == "not verified"){
                    console.log("not verified");
                    // console.log(response.data)
                    // this.props.signedIn(response.data.nickName, response.data.userId);
                    // this.props.history.push('/');
                    alert("Your account is not verified yet. Please follow the instructions in the verification email.");
                }
            } catch (err) {
                console.log(err);
            }
        }

    }

    render() {
        return(
            <div>
                <br/><h1>Sign In</h1>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <h6>Email Address:</h6>
                    <div style={{"padding":"5px"}}>
                        <TextField id="email" size="small" placeholder="email address" variant="outlined" onChange={this.handleChange} />
                    </div>
                    <h6>Password:</h6>
                    <div style={{"padding":"5px"}}>
                        <TextField id="password" type="password" size="small" placeholder="password" variant="outlined" onChange={this.handleChange} />
                    </div>
                    <br/>
                    <Button type="submit" className="search-btn">Sign In</Button>
                    <Link to="/forgetpassword"><Button className="search-btn">Forget Password</Button></Link>
                    <br/><br/>
                    <div className="border-bottom-accent"></div>
                </form>
            </div>

        );
    }
}
export default SignInScreen;

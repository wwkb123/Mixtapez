import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TextField } from '@material-ui/core';
import UserAPI from "../apis/UserAPI";

class ForgetPasswordScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: ""
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
        if(email !== ""){
            try {
                const response = await UserAPI.post("/forgetpassword", {
                    email
                });
                if(response){
                    console.log("success");
                    this.props.history.push('/emailsent');
                }
            }catch (err) {
                console.log(err);
            }
        }

    }
    render() {
        return(
            <div>
                <br/><h1>Forget Password</h1>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <h6>Enter your email address:</h6>
                    <div style={{"padding":"5px"}}>
                        <TextField id="email" size="small" placeholder="email address" variant="outlined" onChange={this.handleChange}/>
                    </div>
                    {/* <Link
                    to={{
                        pathname: '/verification',
                        state: {
                            changepassword: true
                        }
                    }}> */}

                        <Button type="submit" className="search-btn">Submit</Button>
                    {/* </Link> */}
                    <br/><br/>
                    <div className="border-bottom-accent"></div>
                </form>
            </div>

        );
    }
}
export default ForgetPasswordScreen;

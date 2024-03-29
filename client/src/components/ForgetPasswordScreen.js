import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
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

    updateNavBar = () => {
        var navbtns = document.getElementsByClassName("nav-btn");
        if(navbtns){
            for(let i = 0; i < navbtns.length; i++){
                if(navbtns[i]){
                    if(navbtns[i].id === "forgetpassword"){
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

    onSubmit = async (e) => {
        e.preventDefault();
        var email = this.state.email;
        if(email !== ""){
            var toast = document.getElementById("loading_toast");
            toast.className = "show"; // show the toast
            // After 3 seconds, remove the show class from toast
            setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
            try {
                const response = await UserAPI.post("/users/forgetPassword", {
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
                        <Button type="submit" className="search-btn">Submit</Button>
                    <br/><br/>
                    <div className="border-bottom-accent"></div>
                </form>
            </div>

        );
    }
}
export default ForgetPasswordScreen;

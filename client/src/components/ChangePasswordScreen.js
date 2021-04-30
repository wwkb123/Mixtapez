import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { TextField } from '@material-ui/core';
import UserAPI from "../apis/UserAPI";

class ChangePasswordScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            newPassword: "",
            newPasswordConfirm: ""
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
                    if(navbtns[i].id === "changepassword"){
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
        var newPassword = this.state.newPassword;
        var newPasswordConfirm = this.state.newPasswordConfirm;

        if(newPassword !== "" && newPasswordConfirm !== ""){ 
            if(newPassword === newPasswordConfirm){
                try {
                    const response = await UserAPI.post("/users/changePassword", {
                        id: this.props.match.params.id,
                        newPassword
                    });
                    if(response.data.status === "success"){ // change password successfully
                        console.log("success");
                        alert("Password has changed successfully");
                        this.props.history.push('/signin');
                    }else{
                        this.props.history.push('/error');
                    }
                }catch (err) {
                    console.log(err);
                }
            }else{
                alert("New passwords doesn't match. Please try again.");
            }
        }
    }

    render() {
        return(
            <div>
                <br/><h1>Change Password</h1>
                    <form onSubmit={(e) => this.onSubmit(e)}>
                    <h6>New Password:</h6>
                    <div style={{"padding":"5px"}}>
                        <TextField id="newPassword"  type="password" size="small" placeholder="new password" variant="outlined" onChange={this.handleChange}/>
                    </div>
                    <h6>Confirm New Password:</h6>
                    <div style={{"padding":"5px"}}>
                        <TextField id="newPasswordConfirm"  type="password" size="small" placeholder="confirm new password" variant="outlined" onChange={this.handleChange}/>
                    </div>
                    <br/>
                        <Button type="submit" className="search-btn">Submit</Button>
                    <br/><br/>
                    <div className="border-bottom-accent"></div>
                </form>
            </div>

        );
    }
}
export default ChangePasswordScreen;

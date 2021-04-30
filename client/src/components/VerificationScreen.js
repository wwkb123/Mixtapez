import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import UserAPI from "../apis/UserAPI";

class VerificationScreen extends Component{
    onClick = async (e) => {
        e.preventDefault();
        try {
            const response = await UserAPI.post("/verify", {
                id: this.props.match.params.id
            });
            if(response.data.status === "success"){
                console.log("success");
                this.props.signedIn(response.data.nickName, response.data.userId);
                this.props.history.push('/');
            }else{
                this.props.history.push('/error');
            }
        }catch (err) {
            console.log(err);
        }
    }

    render() {
        console.log(this.props.location.state);
        var link = "/";
        if(this.props.location.state){
            if(this.props.location.state.changepassword){
                link = "/changepassword";
            }
        }
        return(
            <div>
                <br/><h1>Verification</h1>
                    <Button onClick={this.onClick} className="search-btn">Verify</Button>
                <br/><br/>
                <div className="border-bottom-accent"></div>
            </div>

        );
    }
}
export default VerificationScreen;

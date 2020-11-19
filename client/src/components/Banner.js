import React, {Component} from 'react'
import Container from 'react-bootstrap/Container'
import { Grid} from '@material-ui/core';
class Banner extends Component{
    constructor(props){
        super(props);
    }

    nickNameControl = () =>{
        var user = localStorage.getItem('user');
        console.log("user is", user);
        if (user) {
            return <div>Welcome {user.nickName}</div>           
        }
        return <div/>
    }
    
    render(){
        return(
            <Container className="banner-container">
                <Grid container spacing={0}>
                    <Grid item xs ={3}>
                        <div>Mixtapez</div>
                    </Grid>
                    <Grid item xs ={3}>                        
                    </Grid>
                    <Grid item xs ={5}>
                        {this.nickNameControl()}
                    </Grid>                 
                </Grid>
            </Container>
        );
    };
}

export default Banner;
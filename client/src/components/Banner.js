import React, {Component} from 'react'
import Container from 'react-bootstrap/Container'
import { Grid} from '@material-ui/core';
class Banner extends Component{
    constructor(props){
        super(props);
    }

    nickNameControl = () =>{
        var nickName = localStorage.getItem('userNickName');
        // console.log("user is", user);
        if (nickName) {
            return <div>Welcome {nickName}</div>           
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
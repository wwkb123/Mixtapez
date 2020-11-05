import React, {Component} from 'react'
import Container from 'react-bootstrap/Container'
import { Grid} from '@material-ui/core';
class Banner extends Component{
    render(){
        return(
            <Container className="banner-container">
                <Grid container spacing={0}>
                    <Grid item xs ={3}>
                        <div>Mixtapez</div>
                    </Grid>
                    <Grid item xs ={5}>                        
                    </Grid>
                    <Grid item xs ={3}>
                        <div>Welcome</div>
                    </Grid>                 
                </Grid>
            </Container>
        );
    };
}

export default Banner;
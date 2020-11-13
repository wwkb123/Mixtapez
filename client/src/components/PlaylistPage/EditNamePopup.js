import React,{Component} from "react";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { TextField } from '@material-ui/core';

class EditNamePopup extends Component{
    constructor(props){
        super(props);
        this.state= {
            modalInputName: "",
        }
    }
    handleChange = (e) => {
        const {target} = e;
    
        this.setState( (state) => ({
            ...state,
            [target.id]: target.value
    
        }));
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let inputName = this.state.modalInputName;
        if(inputName){
            console.log(this.props.musicListId);
            console.log(inputName);
            this.props.updateMusicList({
                variables:{
                    musicListId: this.props.musicListId,
                    musicListNewName: inputName
                }
            })
            this.props.handleClose()
        }else{
            alert("cannot be empty")
        }
    }

    render(){
        return(
            <div className={"modal d-block"} style={{visibility: this.props.show ? 'visible' : 'hidden' }}>
                <Container>
                    <h2>New name</h2>
                    <div className="form-group">
                        <label>Enter Name:</label>
                        <TextField id="modalInputName" size="small" type="name" placeholder="new name" variant="outlined" onChange={this.handleChange}/>
                    </div>
                    <Row>
                        <Button onClick={e => this.handleSubmit(e)}>
                            Save
                        </Button>
                        <Button className="modal-close" onClick={this.props.handleClose}>
                            close
                        </Button>
                    </Row>
                </Container>
            </div>
        )
    }

    
}


export default EditNamePopup;

import React,{Component} from "react";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { TextField } from '@material-ui/core';
import UserAPI from "../../apis/UserAPI";

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
                    musicListNewName: inputName,
                    isPublic: this.props.isPublic
                }
            })
            try{
                const response = await UserAPI.get("/user/musicLists/"+this.props.userId);
                if(response.data.status === "success"){ // search success
                    console.log("success");
                    console.log("musiclists is", response.data.musicLists);
                    var playlistsChangeHandler = this.props.handler;
                    playlistsChangeHandler(response.data.musicLists);
                }
            }catch(err){
                console.log(err);
            }
            this.props.handleClose()
        }else{
            alert("cannot be empty")
        }
    }

    render(){
        return(
            <div className={"modal d-block"} style={{visibility: this.props.show ? 'visible' : 'hidden' }}>
                <div className="modal-content">
                    <span onClick={this.props.handleClose} className="close">&times;</span>
                <Container>
                    <h2>Edit Playlist Name:</h2>
                    
                    <div className="form-group">
                        <TextField id="modalInputName" size="small" type="name" placeholder="new name" variant="outlined" onChange={this.handleChange}/>
                    </div>
                    <Row>
                        <Button className="search-btn" onClick={e => this.handleSubmit(e)}>
                            Save
                        </Button>
                        <Button className="modal-close cancel-btn" onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                    </Row>
                </Container>
                </div>
            </div>
        )
    }

    
}


export default EditNamePopup;

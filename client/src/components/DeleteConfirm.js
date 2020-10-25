import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DeleteConfirmPopUp extends Component{
  constructor(props){
      super(props);

      this.state = {open: false};
      this.handleClick = this.handleClick.bind(this);
  }

  handleClickOpen = () => {
    setOpen(true);
  };

  handleClose = () => {
    setOpen(false);
  };
  render(){
    return (
            <div>
                <Button variant="outlined" color="nav-btn" onClick={handleClickOpen}>
                    Open alert dialog
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm to delete"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Once a playlist is deleted, it can't be retrieved again. Are you sure to delete?
                            </DialogContentText>
                        </DialogContent>
                    <DialogActions>                        
                        <Button onClick={handleClose} color="nav-btn">
                            Cancel
                        </Button>
                        <Button onClick={handleClose} color="nav-btn" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default DeleteConfirmPopUp
import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

const GameLinkDialog = (props) => {
    const classes = useStyles();
    const {open = false, setShowGameLinkDialog} = props;

    const linkTextFieldRef = useRef();
    const [copySuccess, setCopySuccess] = useState(false);

    const onCopyToClipboard = (e) => {
        linkTextFieldRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        setCopySuccess(true);
        resetGameSetupCookie();
        setTimeout(() => {
            setCopySuccess(false);
        }, 2000);
    };

    const onCloseGameLinkDialog = () => {
        resetGameSetupCookie();
        setShowGameLinkDialog(false);
    }

    const resetGameSetupCookie = async () => {
        try {
            await axios.post('/reset-game-setup-cookie');
            console.log("done!");
        } catch (error) {
            // onError(error);
            console.log("error in resetGameSetupCookie");
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onCloseGameLinkDialog}
            >
                <DialogTitle >
                    Copy game link
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onCloseGameLinkDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Copy the link below and send it out to all players. Then meet your players in a video call before starting the game :-)
                    </DialogContentText>
                    <TextField
                        inputRef={linkTextFieldRef}
                        readOnly={true}
                        fullWidth={true}
                        variant='outlined'
                        value={window.location.href}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        fullWidth={true}
                        variant="contained"
                        onClick={onCopyToClipboard}
                        color="primary"
                        startIcon={copySuccess ? <CheckIcon/> : <FileCopyIcon/>}
                    >
                        {copySuccess ? "Copied!" : "Copy Link"}
                    </Button>
                    {/*<Button onClick={() => setGameLinkDialogOpen(false)} color="primary">*/}
                    {/*    Close*/}
                    {/*</Button>*/}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default GameLinkDialog;
import React, { useState, useRef, FunctionComponent } from "react";
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

interface StartNewGameDialogProps {
    newGameId?: string;
    setNewGameId: (newGameId?: string) => void;
}

const StartNewGameDialog: FunctionComponent<StartNewGameDialogProps> = (props) => {
    const classes = useStyles();
    const {newGameId, setNewGameId} = props;

    return (
        <>
            <Dialog
                open={!!newGameId}
                onClose={() => setNewGameId(undefined)}
            >
                <DialogTitle >
                    Start new game
                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => setNewGameId(undefined)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        A new game was started! Do you want to join? :-)
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        fullWidth={true}
                        variant="contained"
                        onClick={() => location.replace(`/game/${newGameId}/`)}
                        color="primary"
                    >
                        Go!
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default StartNewGameDialog;
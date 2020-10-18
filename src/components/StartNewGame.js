import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles({
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        // height: "2.8rem",
        padding: "5px 20px",
        backgroundColor: "#eeeeee"
    }
});

const StartNewGame = (props) => {
    const {onStartNewGame} = props;
    const classes = useStyles();

    const [startNewGameDialogOpen, setStartNewGameDialogOpen] = useState(false);

    const onStartNewGameClick = () => {
        onStartNewGame();
        setStartNewGameDialogOpen(false);
    };


    return (
        <>
            <Box className={classes.footer} display='flex' alignSelf="center">
                <Button onClick={() => setStartNewGameDialogOpen(true)}>Start new game</Button>

            </Box>
            <Dialog
            open={startNewGameDialogOpen}
            onClose={() => setStartNewGameDialogOpen(false)}
                >
                <DialogTitle >
                Start new game
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to start a new game?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={() => setStartNewGameDialogOpen(false)} color="primary">
                    Cancel
                    </Button>
                <Button onClick={onStartNewGameClick} color="primary">
                    Start new game
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default StartNewGame;
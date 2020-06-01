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
        height: "2.5rem",
    }
});

const RestartGame = (props) => {
    const {onRestartGame} = props;
    const classes = useStyles();

    const [restartDialogOpen, setRestartDialogOpen] = useState(false);

    const onRestartClick = () => {
        onRestartGame();
        setRestartDialogOpen(false);
    };


    return (
        <>
            <Box className={classes.footer}>
                <Button onClick={() => setRestartDialogOpen(true)}>Restart game</Button>

            </Box>
            <Dialog
            open={restartDialogOpen}
            onClose={() => setRestartDialogOpen(false)}
                >
                <DialogTitle >
                Restart Game
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to restart the game?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={() => setRestartDialogOpen(false)} color="primary">
                    Cancel
                    </Button>
                <Button onClick={onRestartClick} color="primary">
                    Restart Game
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default RestartGame;
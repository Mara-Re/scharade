import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles({
    startGameButton: {
        color: "#fff"
    },
    title: {
        maxWidth: "50px"
    }
});

const StartGame = (props) => {
    const {onStartGame} = props;
    const classes = useStyles();

    const [startDialogOpen, setStartDialogOpen] = useState(false);

    const onStartClick = () => {
        onStartGame();
        setStartDialogOpen(false);
    };


    return (
        <>
            <Box display="flex" alignSelf="center">
                <Box alignSelf="center">
                    <Typography variant="body1" align="right" className={classes.title}>
                        Start Game
                    </Typography>
                </Box>

                <Box alignSelf="center">
                    <IconButton onClick={() => setStartDialogOpen(true)} className={classes.startGameButton}>
                        <PlayArrowIcon fontSize="large"/>
                    </IconButton>
                </Box>
            </Box>
            <Dialog
                open={startDialogOpen}
                onClose={() => setStartDialogOpen(false)}
            >
                <DialogTitle >
                    Start Game
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please make sure that all players have entered their words! Are you sure you want to start the game?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setStartDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onStartClick} color="primary">
                        Start Game
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default StartGame;
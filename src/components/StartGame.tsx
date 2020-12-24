import React, { FunctionComponent, useCallback, useContext, useState } from "react";
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
import axios from "axios";
import { GameStatus } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import { socket } from "../pages/Game";

const useStyles = makeStyles({
    startGameButton: {
        color: "#fff"
    },
    title: {
        maxWidth: "50px"
    }
});

const StartGame: FunctionComponent<{}> = (props) => {
    const classes = useStyles();

    const {gameUid, reloadStatus = () => {}, onError = () => {}} = useContext(StatusContext);

    const [startDialogOpen, setStartDialogOpen] = useState(false);

    const onStartGame = useCallback(async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, { status: GameStatus.START });
            await axios.post(`/games/${gameUid}/createTeams`);

            socket.emit("start-game");
            reloadStatus();
            setStartDialogOpen(false);
        } catch (error) {
            onError(error);
        }
    }, [gameUid, reloadStatus, onError]);

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
                    <Button onClick={onStartGame} color="primary">
                        Start Game
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default StartGame;
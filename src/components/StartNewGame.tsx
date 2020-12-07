import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useState,
} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { GameStatus, StatusContext } from "../contexts/StatusContext";
import { socket } from "../pages/App";
import axios from "axios";

const StartNewGame: FunctionComponent<{}> = () => {
    const [startNewGameDialogOpen, setStartNewGameDialogOpen] = useState(false);
    const { gameUid, reloadStatus = () => {}, onError = () => {} } = useContext(
        StatusContext
    );

    const onStartNewGame = useCallback(async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, { status: GameStatus.SETUP });
            await axios.delete(`/games/${gameUid}/words`);
            await axios.delete(`/games/${gameUid}/teams/`);
            socket.emit("start-new-game");
            reloadStatus();
            setStartNewGameDialogOpen(false);
        } catch (error) {
            onError(error);
        }
    }, [gameUid, reloadStatus, onError]);

    return (
        <>
            <Button onClick={() => setStartNewGameDialogOpen(true)}>
                Start over
            </Button>
            <Dialog
                open={startNewGameDialogOpen}
                onClose={() => setStartNewGameDialogOpen(false)}
            >
                <DialogTitle>Start over</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to start a fresh game?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={() => setStartNewGameDialogOpen(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={onStartNewGame} color="primary">
                        Start new game
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StartNewGame;

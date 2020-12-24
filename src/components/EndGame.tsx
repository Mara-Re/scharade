import React, {
    useState,
    FunctionComponent,
    useCallback,
    useContext,
} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
import { StatusContext } from "../contexts/StatusContext";
import { socket } from "../pages/Game";

const EndGame: FunctionComponent<{}> = () => {
    const { gameUid, reloadStatus = () => {}, onError = () => {} } = useContext(
        StatusContext
    );

    const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);

    const onEndGame = useCallback(async () => {
        try {
            await axios.post(`/games/${gameUid}/endGame`);
            socket.emit("end-game");
            reloadStatus();
            setEndGameDialogOpen(false);
        } catch (error) {
            onError(error);
        }
    }, [reloadStatus, gameUid, onError]);

    return (
        <>
            <Button onClick={() => setEndGameDialogOpen(true)}>End game</Button>

            <Dialog
                open={endGameDialogOpen}
                onClose={() => setEndGameDialogOpen(false)}
            >
                <DialogTitle>End game</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to end the current game and see
                        the final scores?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={() => setEndGameDialogOpen(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={onEndGame} color="primary">
                        End game
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EndGame;

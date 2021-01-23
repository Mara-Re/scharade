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
import { StatusContext } from "../contexts/StatusContext";
import { socket } from "../pages/Game";
import axios from "axios";

const StartNewGame: FunctionComponent<{}> = () => {
    const [startNewGameDialogOpen, setStartNewGameDialogOpen] = useState(false);
    const { onError = () => {} } = useContext(
        StatusContext
    );

    const onStartNewGame = useCallback(async () => {
        try {
            const { data } = await axios.post("/games");
            const newGameId = data[0].uid;
            socket.emit("start-new-game", {gameId: newGameId});
            location.replace(`/game/${newGameId}/`);
        } catch (error) {
            onError(error);
        }
    }, [onError]);

    return (
        <>
            <Button onClick={() => setStartNewGameDialogOpen(true)}>
                Start new game
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

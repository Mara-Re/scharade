import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useState,
} from "react";
import EditIcon from "@material-ui/icons/Edit";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { Dialog } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { StatusContext } from "../contexts/StatusContext";
import IconButton from "@material-ui/core/IconButton";
import { socket } from "../pages/Game";

const EditNrOfWordsPerPlayer: FunctionComponent<{}> = () => {
    const { onError = () => {}, reloadGame = () => {}, reloadPlayersList = () => {}, gameUid, isGameHost } = useContext(
        StatusContext
    );
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const onNrOfWordsChoice = useCallback(
        async (nrOfWordsPerPlayer) => {
            try {
                await axios.put(`/games/${gameUid}/nrOfWordsPerPlayer`, { nrOfWordsPerPlayer });
                reloadGame();
                reloadPlayersList();
                socket.emit("new-nr-of-words-per-player");
                setEditDialogOpen(false);
            } catch (error) {
                onError(error);
            }
        },
        [onError, gameUid]
    );

    if (!isGameHost) return null;

    return (
        <>
            <IconButton onClick={() => setEditDialogOpen(true)}>
                <EditIcon />
            </IconButton>
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
            >
                <DialogTitle>Adjust the number of words per player</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {[2, 3, 4, 5, 6, 7].map((number) => (
                            <Button
                                key={number}
                                size="large"
                                onClick={() => onNrOfWordsChoice(number)}
                            >
                                {number}
                            </Button>
                        ))}
                    </DialogContentText>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </>
    );
};

export default EditNrOfWordsPerPlayer;

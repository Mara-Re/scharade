import React, { FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

interface StartNewGameProps {
    onStartNewGame: () => void;
}

const StartNewGame: FunctionComponent<StartNewGameProps> = (props) => {
    const {onStartNewGame} = props;

    const [startNewGameDialogOpen, setStartNewGameDialogOpen] = useState(false);

    const onStartNewGameClick = () => {
        onStartNewGame();
        setStartNewGameDialogOpen(false);
    };

    return (
        <>
            <Button onClick={() => setStartNewGameDialogOpen(true)}>Start over</Button>
            <Dialog
            open={startNewGameDialogOpen}
            onClose={() => setStartNewGameDialogOpen(false)}
                >
                <DialogTitle >
                Start over
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to start a fresh game?
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
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";


const EndGame = (props) => {
    const {onEndGame} = props;

    const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);

    const onEndGameClick = () => {
        onEndGame();
        setEndGameDialogOpen(false);
    };


    return (
        <>
            <Button onClick={() => setEndGameDialogOpen(true)}>End game</Button>

            <Dialog
                open={endGameDialogOpen}
                onClose={() => setEndGameDialogOpen(false)}
            >
                <DialogTitle>
                    End game
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to end the current game and see the final scores?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setEndGameDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onEndGameClick} color="primary">
                        End game
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EndGame;
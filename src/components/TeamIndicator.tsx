import React, {useState, FunctionComponent, useEffect } from "react";
import { Button } from "@material-ui/core/";
import TeamEmoji from "./TeamEmoji";
import { Team } from "./../pages/App";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { Dialog } from '@material-ui/core';
import ChooseTeam from "./ChooseTeam";
import BorderedIconButton from "./IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    square: {
        height: "30px",
        width: "30px",
    }
});

interface TeamIndicatorProps {
    team: Team | null;
    setTeam: (team: Team) => void;
}

const TeamIndicator: FunctionComponent<TeamIndicatorProps> = (props) => {
    const {team, setTeam} = props;

    const classes = useStyles();

    useEffect(() => {
        if (team === null) {
            setChooseTeamModalOpen(true);
        }
    }, [team]);

    const [chooseTeamModalOpen, setChooseTeamModalOpen] = useState(false);

    return (
        <>
            <BorderedIconButton onClick={() => setChooseTeamModalOpen(true)}>
                <div className={classes.square}>
                    <TeamEmoji teamNumber={team}/>
                </div>
            </BorderedIconButton>
            <Dialog open={chooseTeamModalOpen}
                    onClose={() => setChooseTeamModalOpen(false)}
                    disableBackdropClick={!team}>
            </Dialog>
            <Dialog
                open={chooseTeamModalOpen}
                onClose={() => setChooseTeamModalOpen(false)}
                disableBackdropClick={!team}
            >
                <DialogTitle >
                    Choose Team
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <ChooseTeam setTeam={setTeam} team={team} displayTitle={false}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {team && (
                        <Button onClick={() => setChooseTeamModalOpen(false)} color="primary">
                            Done
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TeamIndicator;
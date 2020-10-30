import React, {useState, FunctionComponent } from "react";
import { Button } from "@material-ui/core/";
import TeamEmoji from "./TeamEmoji";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
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
    team: "1" | "2";
    setTeam: () => void;
}

const Test: FunctionComponent<TeamIndicatorProps> = ({team}) => {
    return <><p>!</p></>;
}

const TeamIndicator: FunctionComponent<TeamIndicatorProps> = (props)  => {
    const {team, setTeam} = props;

    const classes = useStyles();

    const [chooseTeamModalOpen, setChooseTeamModalOpen] = useState(false);

    return (
        <>
            <BorderedIconButton onClick={() => setChooseTeamModalOpen(true)}>
                <div className={classes.square}>
                    <TeamEmoji teamNumber={team}/>
                </div>
            </BorderedIconButton>
            {/*<Dialog*/}
            {/*    open={chooseTeamModalOpen}*/}
            {/*    onClose={() => setChooseTeamModalOpen(false)}*/}
            {/*>*/}
            {/*    <DialogTitle >*/}
            {/*        Choose Team*/}
            {/*    </DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText>*/}
            {/*            <ChooseTeam setTeam={setTeam} team={team} displayTitle={false}/>*/}
            {/*        </DialogContentText>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={() => setChooseTeamModalOpen(false)} color="primary">*/}
            {/*            Done*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </>
    );
}

export default TeamIndicator;
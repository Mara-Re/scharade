import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import TeamEmoji from "./TeamEmoji";
import { Team } from "../pages/App";

const useStyles = makeStyles({
    chooseTeamBox: {
        margin: "auto",
        textAlign: "center"
    }
});

interface ChooseTeamProps {
    team?: Team | null;
    setTeam: (team: Team) => void;
    displayTitle?: boolean;
}

const ChooseTeam: FunctionComponent<ChooseTeamProps> = (props) => {
    const {team, setTeam, displayTitle = true} = props;
    const classes = useStyles();

    const handleTeamChoice = (_: any, newTeamChoice: Team | undefined) => {
        if (!newTeamChoice) return;
        setTeam(newTeamChoice);
    }

    return (
        <Box justifyContent='center' alignItems="center" className={classes.chooseTeamBox}>
            {displayTitle && <Typography variant="h6" gutterBottom>
                Choose a Team
            </Typography>}
            <ToggleButtonGroup
                value={team}
                exclusive
                onChange={handleTeamChoice}
            >
                <ToggleButton value={1}>
                    <Typography variant={team === 1 ? "h3" : "h6"}>
                        <TeamEmoji teamNumber={1}/>
                    </Typography>
                </ToggleButton>
                <ToggleButton value={2}>
                    <Typography variant={team === 2 ? "h3" : "h6"}>
                        <TeamEmoji teamNumber={2}/>
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

export default ChooseTeam;
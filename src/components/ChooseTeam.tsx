import React, { FunctionComponent, useCallback, useContext } from "react";
import Box from "@material-ui/core/Box";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import TeamEmoji from "./TeamEmoji";
import axios from "axios";
import { StatusContext, Team } from "../contexts/StatusContext";

const useStyles = makeStyles({
    chooseTeamBox: {
        margin: "auto",
        textAlign: "center"
    }
});

interface ChooseTeamProps {
    // TODO: remove team and setTeam from props when not needed anymore
    team?: Team | null;
    setTeam?: (team: Team) => void;
    displayTitle?: boolean;
}

const ChooseTeam: FunctionComponent<ChooseTeamProps> = (props) => {

    const {reloadTeam = () => {}, onError = () => {}, team} = useContext(StatusContext);
    const { displayTitle = true} = props;
    const classes = useStyles();

    const handleTeamChoice = useCallback(async (_: any, newTeamChoice: Team | undefined) => {
        if (!newTeamChoice) return;
        try {
            await axios.post(`/set-team-cookie`, {team: newTeamChoice});
            reloadTeam();
        } catch (error) {
            onError(error);
        }
    }, []);

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
                <ToggleButton value="A">
                    <Typography variant={team === "A" ? "h3" : "h6"}>
                        <TeamEmoji team="A"/>
                    </Typography>
                </ToggleButton>
                <ToggleButton value="B">
                    <Typography variant={team === "B" ? "h3" : "h6"}>
                        <TeamEmoji team="B"/>
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

export default ChooseTeam;
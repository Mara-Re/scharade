import React, { FunctionComponent, useCallback, useContext } from "react";
import Box from "@material-ui/core/Box";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import TeamEmoji from "./TeamEmoji";
import axios from "axios";
import { StatusContext } from "../contexts/StatusContext";
import { Team } from "../pages/Game";
import TeamToggleButton from "./TeamToggleButton";

const useStyles = makeStyles({
    chooseTeamBox: {
        margin: "auto",
        textAlign: "center",
    },
});

interface ChooseTeamProps {
    displayTitle?: boolean;
}

const ChooseTeam: FunctionComponent<ChooseTeamProps> = (props) => {
    const { reloadPlayerMe = () => {}, onError = () => {}, playerMe, gameUid } = useContext(
        StatusContext
    );
    const { displayTitle = true } = props;
    const classes = useStyles();

    // TODO: adjust handleTeamChoice -> adjust player instead of setting cookie
    const handleTeamChoice = useCallback(
        async (_: any, newTeamChoice: Team | undefined) => {
            if (!newTeamChoice) return;
            try {
                await axios.put(`/games/${gameUid}/player`, { team: newTeamChoice });
                reloadPlayerMe();
            } catch (error) {
                onError(error);
            }
        },
        []
    );

    return (
        <Box
            justifyContent="center"
            alignItems="center"
            className={classes.chooseTeamBox}
        >
            {displayTitle && (
                <>
                    <Typography variant="h6" gutterBottom>
                        Choose a team
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Split the group into two teams.
                    </Typography>
                </>
            )}
            <TeamToggleButton onTeamChoice={handleTeamChoice} team={playerMe?.teamAorB}/>
        </Box>
    );
};

export default ChooseTeam;

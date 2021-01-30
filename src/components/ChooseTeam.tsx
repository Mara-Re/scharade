import React, { FunctionComponent, useCallback, useContext } from "react";
import Box from "@material-ui/core/Box";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import TeamEmoji from "./TeamEmoji";
import axios from "axios";
import { StatusContext } from "../contexts/StatusContext";
import { socket, Team } from "../pages/Game";
import TeamToggleButton from "./TeamToggleButton";

const useStyles = makeStyles({
    chooseTeamBox: {
        margin: "auto",
        textAlign: "center",
    },
});

interface ChooseTeamProps {
    onChoice?: () => void;
}

const ChooseTeam: FunctionComponent<ChooseTeamProps> = (props) => {

    const { onChoice = () => {} } = props;
    const { reloadPlayerMe = () => {}, onError = () => {}, reloadPlayersList = () => {}, playerMe, gameUid } = useContext(
        StatusContext
    );
    const classes = useStyles();

    const handleTeamChoice = useCallback(
        async (_: any, newTeamChoice: Team | undefined) => {
            if (!newTeamChoice) return;
            try {
                await axios.put(`/games/${gameUid}/playerMe`, { team: newTeamChoice });
                socket.emit("switch-team");
                reloadPlayerMe();
                reloadPlayersList();
                onChoice();
            } catch (error) {
                onError(error);
            }
        },
        [gameUid, reloadPlayersList, reloadPlayerMe, onError, onChoice]
    );

    return (
        <Box
            justifyContent="center"
            alignItems="center"
            className={classes.chooseTeamBox}
        >
            <TeamToggleButton onTeamChoice={handleTeamChoice} team={playerMe?.teamAorB}/>
        </Box>
    );
};

export default ChooseTeam;

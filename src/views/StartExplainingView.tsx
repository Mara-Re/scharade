import React, {
    FunctionComponent,
    useCallback,
    useContext,
} from "react";
import CentralBox from "../components/CentralBox";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { socket } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import timeToExplain from "../shared/time-to-explain";
import TeamEmoji from "../components/TeamEmoji";
import { Button, Typography } from "@material-ui/core";
import CenterBox from "../components/CenterBox";
import getOppositeTeam from "../helper/getOppositeTeam";
import { makeStyles } from "@material-ui/core/styles";
import RoundIndicator from "../components/RoundIndicator";

const useStyles = makeStyles({
    spacingTop: {
        marginTop: "2rem",
    },
    spacing: {
        marginTop: "60px",
        marginBottom: "60px",
    }
});

const StartExplainingView: FunctionComponent<{}> = () => {
    const {
        loadingGameStatus,
        setCountdown = () => {},
        playerMe,
        teamExplaining,
        currentRound = 0,
    } = useContext(StatusContext);

    const classes = useStyles();

    const nextTeamExplaining = getOppositeTeam(teamExplaining);

    const onStartExplaining = useCallback(async () => {
        if (!playerMe) return;
        setCountdown(timeToExplain);
        socket.emit("start-explaining", { player: playerMe });
    }, [playerMe, timeToExplain]);

    if (loadingGameStatus) return null;

    return (
        <CentralBox>
            <RoundIndicator round={currentRound} />
            {nextTeamExplaining && <CenterBox className={classes.spacing}>
                <Typography variant="h4">
                    It is <TeamEmoji team={nextTeamExplaining} />
                    ’s turn.
                </Typography>
            </CenterBox>}
            {nextTeamExplaining && playerMe?.teamAorB === nextTeamExplaining && (
                <CenterBox className={classes.spacingTop}>
                    <Button
                        onClick={() => onStartExplaining()}
                        variant="outlined"
                        color="primary"
                        endIcon={<PlayArrowIcon fontSize="large" />}
                    >
                        Start Explaining
                    </Button>
                </CenterBox>
            )}
        </CentralBox>
    );
};

export default StartExplainingView;

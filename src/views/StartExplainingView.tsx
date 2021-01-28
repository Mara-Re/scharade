import React, { FunctionComponent, useCallback, useContext, useEffect } from "react";
import CentralBox from "../components/CentralBox";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ActionMessage from "../components/ActionMessage";
import { socket } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import timeToExplain from "../shared/time-to-explain";
import TeamEmoji from "../components/TeamEmoji";
import { Typography } from "@material-ui/core";
import CenterBox from "../components/CenterBox";
import getOppositeTeam from "../helper/getOppositeTeam";

const StartExplainingView: FunctionComponent<{}> = () => {
    const {
        loadingGameStatus,
        setCountdown = () => {},
        playerMe,
        teamExplaining,
    } = useContext(StatusContext);

    const nextTeamExplaining = getOppositeTeam(teamExplaining);

    const onStartExplaining = useCallback(async () => {
        if (!playerMe) return;
        setCountdown(timeToExplain);
        socket.emit("start-explaining", {player : playerMe});
    }, [playerMe, timeToExplain]);

    if (loadingGameStatus) return null;

    return (
        <CentralBox>
            {nextTeamExplaining && playerMe?.teamAorB !== nextTeamExplaining &&(
                <CenterBox >
                    <Typography variant="h3">
                        It is <TeamEmoji team={nextTeamExplaining} />
                        's turn.
                    </Typography>
                </CenterBox>
            )}
            {nextTeamExplaining && playerMe?.teamAorB === nextTeamExplaining && (
                <>
                    <CenterBox>
                        <Typography variant="h2" gutterBottom>
                            <TeamEmoji team={nextTeamExplaining} />
                        </Typography>
                    </CenterBox>
                    <ActionMessage
                        onAction={onStartExplaining}
                        actionIcon={<PlayArrowIcon fontSize="large" />}
                    >
                        Have you agreed on who should start explaining? If it's
                        your turn click start.
                    </ActionMessage>
                </>
            )}
        </CentralBox>
    );
};

export default StartExplainingView;

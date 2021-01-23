import React, { FunctionComponent, useCallback, useContext } from "react";
import CentralBox from "../components/CentralBox";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ActionMessage from "../components/ActionMessage";
import { socket } from "../pages/Game";
import { StatusContext } from "../contexts/StatusContext";
import timeToExplain from "../shared/time-to-explain";

const StartExplainingView: FunctionComponent<{}> = () => {
    const { loadingGameStatus, setCountdown = () => {}, team } = useContext(
        StatusContext
    );

    const onStartExplaining = useCallback(async () => {
        setCountdown(timeToExplain);
        socket.emit("start-explaining", {team});
    }, []);

    if (loadingGameStatus) return null;

    return (
        <CentralBox>
            <ActionMessage
                onAction={onStartExplaining}
                actionIcon={<PlayArrowIcon fontSize="large" />}
            >
                Have you agreed on who should start explaining? If it's your
                turn click start.
            </ActionMessage>
        </CentralBox>
    );
};

export default StartExplainingView;

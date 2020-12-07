import React, { FunctionComponent, useCallback, useContext } from "react";
import CentralBox from "../components/CentralBox";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ActionMessage from "../components/ActionMessage";
import axios from "axios";
import { socket } from "../pages/App";
import { PlayerExplaining, StatusContext } from "../contexts/StatusContext";

const StartExplainingView: FunctionComponent<{}> = () => {

    const {gameUid, onError = () => {}, reloadStatus = () => {}, setPlayerExplaining = () => {} } = useContext(StatusContext);
    const onStartExplaining = useCallback(async () => {
        try {
            await axios.post(`/games/${gameUid}/startExplaining`);

            // TODO: is this needed for better UX? so timer is shown right away after click?
            // setCountdown(timeToExplain);
            setPlayerExplaining(PlayerExplaining.SELF);
            reloadStatus();
            socket.emit("start-explaining");
        } catch (error) {
            onError(error);
        }
    }, [gameUid]);

    return (
        <CentralBox>
            <ActionMessage
                onAction={onStartExplaining}
                actionIcon={<PlayArrowIcon fontSize="large" />}
            >
                Did you agree on who should start explaining? If it's your turn click start.
            </ActionMessage>
        </CentralBox>
    )
}

export default StartExplainingView;